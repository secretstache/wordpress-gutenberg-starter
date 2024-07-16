<?php

namespace App;

use Symfony\Component\Process\Exception\ProcessFailedException;
use Symfony\Component\Process\Process;
use Composer\Script\Event;
use Composer\IO\IOInterface;

class ComposerScripts
{
    public static function postCreateProject(Event $event)
    {
        $io = $event->getIO();

        // Get the current working directory, which should be the project directory
        $projectDirectory = getcwd();

        // Extract the last part of the path as the directory name
        $themePublicPathName = basename($projectDirectory); // e.g. ssm2023, amd2024

        $themeName = $io->ask('<question>Theme Name: </question>', 'Wordpress Starter');
        $companyName = $io->ask('<question>Company Name: </question>', 'Secret Stache Media');

        $agencyName = $io->ask('<question>Agency Name: </question>', 'Secret Stache Media');
        $agencyUrl = $io->ask('<question>Agency URL: </question>', 'https://secretstache.com/');
        $textDomain = $io->ask('<question>Text Domain: </question>', 'ssm');

        $isInitGit = $io->askConfirmation('<question>Init Git repository?[y/N]: </question>', true);
        $isPushToGit = false;

        if ($isInitGit) {
            $repositoryUrl = $io->ask('<question>Repository URL: </question>', '');

            $isPushToGit = $io->askConfirmation('<question>Push to the repository at the end?[y/N]: </question>', false);
        }

        $io->write('<comment>Setting up your project...</comment>');

        self::setupStaticBoilerplate($event);

        self::updateReadme($io, $themeName, $companyName, $repositoryUrl);

        self::updateThemeInfo(
            $io,
            $themeName,
            $companyName,
            $agencyName,
            $agencyUrl,
            $textDomain
        );

        self::updateThemePublicPathName($io, $themePublicPathName);

        self::installNpmDependencies($io);
        self::installComposerDependencies($io);

        self::buildAssets($io);

        if ($isInitGit) {
            self::initializeGitRepository($repositoryUrl, $io);

            if ($isPushToGit) {
                self::pushGitRepository($repositoryUrl, $io);
            }
        }
    }

    public static function setupStaticBoilerplate(Event $event)
    {
        $io = $event->getIO();
        $io->write("<comment>Cloning the ssm-static-boilerplate repository...<comment>");

        self::runCommand([
            'git',
            'clone',
            'https://github.com/secretstache/ssm-static-boilerplate',
            'static'
        ], $io);

        // Remove the .git directory
        self::runCommand([
            'rm',
            '-rf',
            './static/.git'
        ], $io);

        $io->write("<info>Complete.</info>");
    }

    private static function initializeGitRepository(string $repositoryUrl, IOInterface $io)
    {
        $io->write("<comment>Init repository...<comment>");

        self::runCommand(['git', 'init'], $io);

        self::runCommand(['git', 'add', '.'], $io);

        // Path to the .gitignore file within the cache directory
        $cacheGitIgnorePath = './storage/framework/cache/.gitignore';

        // Check if the ./storage/framework/cache/.gitignore file exists, and add it to Git
        if (file_exists($cacheGitIgnorePath)) {
            self::runCommand(['git', 'add', '-f', $cacheGitIgnorePath], $io);
        } else {
            $io->write('<error>Cache .gitignore file does not exist, unable to ensure cache directory is tracked.</error>');
        }

        self::runCommand(['git', 'commit', '-m', 'Initial commit'], $io);

        self::runCommand(['git', 'branch', '-M', 'master'], $io);

        self::runCommand(['git', 'checkout', '-b', 'static'], $io);

        self::runCommand(['git', 'checkout', 'master'], $io);

        $io->write("<info>Complete.</info>");
    }

    private static function pushGitRepository(string $repositoryUrl, IOInterface $io)
    {
        $io->write("<comment>Push to the repository...<comment>");

        // It's important to push the 'master' branch before switching away from it, especially if it's the first push.
        self::runCommand(['git', 'push', '-u', 'origin', 'master'], $io);

        // After pushing 'master', you're now on 'static' and can push it as well.
        self::runCommand(['git', 'push', '-u', 'origin', 'static'], $io);

        self::runCommand(['git', 'checkout', 'master'], $io);

        $io->write("<info>Complete.</info>");
    }

    private static function installNpmDependencies(IOInterface $io)
    {
        $io->write("<comment>Installing npm dependencies...<comment>");

        self::runCommand([
            'yarn',
            'install',
        ], $io);

        $io->write("<info>Complete.</info>");
    }

    private static function installComposerDependencies(IOInterface $io)
    {
        $io->write("<comment>Installing composer dependencies...<comment>");

        self::runCommand(['composer', 'install'], $io);

        $io->write("<info>Complete.</info>");
    }

    private static function buildAssets(IOInterface $io)
    {
        $io->write("<comment>Building assets...</comment>");

        self::runCommand([
            'yarn',
            'build',
        ], $io, 360);

        $io->write("<info>Complete.</info>");
    }

    private static function updateReadme(IOInterface $io, string $themeName, string $companyName, string $repositoryUrl = '')
    {
        $filePath = './README.md';

        $io->write('<comment>Updating README.md...</comment>');

        try {
            if (!file_exists($filePath)) {
                throw new \Exception("README.md file does not exist.");
            }

            $fileContent = file_get_contents($filePath);
            if ($fileContent === false) {
                throw new \Exception("Unable to read README.md content.");
            }

            $search = ['THEME_NAME', 'COMPANY_NAME'];
            $replace = [$themeName, $companyName];

            if ($repositoryUrl) {
                $search[] = 'REPOSITORY_URL';
                $replace[] = $repositoryUrl;
            }

            // Replace all placeholders with actual values in a single call
            $fileContent = str_replace($search, $replace, $fileContent);

            // Attempt to write the updated README.md content
            if (file_put_contents($filePath, $fileContent) === false) {
                throw new \Exception("Failed to write updates to README.md.");
            }

            $io->write("<info>Complete.</info>");

        } catch (\Exception $e) {
            $io->write('<error>' . $e->getMessage() . '</error>');
        }
    }

    private static function updateThemeInfo(
        IOInterface $io,
        string $themeName,
        string $companyName,
        string $agencyName,
        string $agencyUrl,
        string $textDomain
    ) {
        $filePath = './style.css';

        $io->write('<comment>Updating style.css...</comment>');

        try {
            if (!file_exists($filePath)) {
                throw new \Exception("style.css file does not exist.");
            }

            $fileContent = file_get_contents($filePath);
            if ($fileContent === false) {
                throw new \Exception("Unable to read style.css content.");
            }

            $search = ['THEME_NAME', 'COMPANY_NAME', 'AGENCY_NAME', 'AGENCY_URL', 'TEXT_DOMAIN'];
            $replace = [$themeName, $companyName, $agencyName, $agencyUrl, $textDomain];

            // Replace all placeholders with actual values in a single call
            $fileContent = str_replace($search, $replace, $fileContent);

            // Attempt to write the updated README.md content
            if (file_put_contents($filePath, $fileContent) === false) {
                throw new \Exception("Failed to write updates to README.md.");
            }

            $io->write("<info>Complete.</info>");

        } catch (\Exception $e) {
            $io->write('<error>' . $e->getMessage() . '</error>');
        }
    }

    private static function updateThemePublicPathName(IOInterface $io, string $themePublicPathName)
    {
        $filePath = './bud.config.js';

        $io->write('<comment>Updating bud.config.js...</comment>');

        try {
            if (!file_exists($filePath)) {
                throw new \Exception("bud.config.js file does not exist.");
            }

            $fileContent = file_get_contents($filePath);
            if ($fileContent === false) {
                throw new \Exception("Unable to read bud.config.js content.");
            }

            $search = ['THEME_PUBLIC_PATH_NAME'];
            $replace = [$themePublicPathName];

            // Replace all placeholders with actual values in a single call
            $fileContent = str_replace($search, $replace, $fileContent);

            // Attempt to write the updated README.md content
            if (file_put_contents($filePath, $fileContent) === false) {
                throw new \Exception("Failed to write updates to bud.config.js");
            }

            $io->write("<info>Complete.</info>");

        } catch (\Exception $e) {
            $io->write('<error>' . $e->getMessage() . '</error>');
        }
    }

    private static function runCommand(array $command, IOInterface $io, $timeoutInSeconds = 60)
    {
        $process = new Process($command);
        $process->setTimeout($timeoutInSeconds);

        try {
            $process->mustRun();
            //$io->write("<info>Executed: " . implode(" ", $command) . "</info>");
        } catch (ProcessFailedException $exception) {
            $io->write("<error>Error executing " . implode(" ", $command) . ": " . $exception->getMessage() . "</error>");
            die;
        }
    }
}
