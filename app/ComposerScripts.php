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

        $themeName = $io->ask('<question>Please enter the Theme Name: </question>', 'Wordpress Starter');
        $clientName = $io->ask('<question>Please enter the Client Name: </question>', 'Secret Stache Media');
        $agencyName = $io->ask('<question>Please enter the Agency Name: </question>', 'Secret Stache Media');
        $agencyUrl = $io->ask('<question>Please enter the Agency URL: </question>', 'https://secretstache.com/');
        $textDomain = $io->ask('<question>Please enter the Text Domain: </question>', 'ssm');

        $repositoryUrl = $io->ask('<question>Please enter the Git repository URL: </question>', 'https://github.com/secretstache/wordpress-starter');

        $io->write('<comment>Setting up your project...</comment>');

        self::setupThemeBoilerplate($event);
        self::setupStaticBoilerplate($event);

        self::updateReadme($io, $themeName, $clientName, $repositoryUrl);
        self::updateThemeInfo($io, $themeName, $agencyName, $agencyUrl, $textDomain);

        self::initializeGitRepository($repositoryUrl, $io);

        self::installPackages($io);
        self::buildAssets($io);
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

        self::runCommand([
            'rm',
            '-rf',
            './.git'
        ], $io);

        $io->write("<info>Static boilerplate setup complete.</info>");
    }

    public static function setupThemeBoilerplate(Event $event)
    {
        $io = $event->getIO();

        $io->write("<comment>Cloning the ssm-theme-boilerplate repository...<comment>");

        self::runCommand([
            'git',
            'clone',
            '-b',
            'prepare-release-3.2.0', // Use the actual branch name
            'https://github.com/secretstache/ssm-theme-boilerplate',
            'theme-boilerplate'
        ], $io);

        $io->write("<comment>Running wp acorn ssm:setup...<comment>");

        self::runCommand(['wp', 'acorn', 'ssm:setup'], $io);

        $io->write("<info>Theme boilerplate setup complete.</info>");
    }

    private static function initializeGitRepository(string $repositoryUrl, IOInterface $io)
    {
        $io->write("<comment>Init repository...<comment>");

        self::runCommand(['git', 'init'], $io);

        $io->write("<comment>Add remote origin...<comment>");
        self::runCommand(['git', 'remote', 'add', 'origin', $repositoryUrl], $io);

        $io->write("<comment>Commit Changes...<comment>");
        self::runCommand(['git', 'add', '.'], $io);
        self::runCommand(['git', 'commit', '-m', 'Initial commit'], $io);

        self::runCommand(['git', 'branch', '-M', 'master'], $io);

        $io->write("<comment>Create a static branch based on master...<comment>");
        self::runCommand(['git', 'checkout', '-b', 'static'], $io);

        // It's important to push the 'master' branch before switching away from it, especially if it's the first push.
        $io->write("<comment>Push master to the repository...<comment>");
        self::runCommand(['git', 'push', '-u', 'origin', 'master'], $io);

        // After pushing 'master', you're now on 'static' and can push it as well.
        $io->write("<comment>Push static to the repository...<comment>");
        self::runCommand(['git', 'push', '-u', 'origin', 'static'], $io);

        $io->write("<comment>Switching back to master branch...<comment>");
        self::runCommand(['git', 'checkout', 'master'], $io);

        $io->write("<info>Success.</info>");
    }

    private static function installPackages(IOInterface $io)
    {
        $io->write("<comment>Install npm dependencies...<comment>");

        self::runCommand([
            'yarn',
            'install',
        ], $io);

        $io->write("<info>Success.</info>");
    }

    private static function buildAssets(IOInterface $io)
    {
        $io->write("<comment>Build assets...</comment>");

        self::runCommand([
            'yarn',
            'build',
        ], $io);

        $io->write("<info>Success.</info>");
    }

    private static function updateReadme(IOInterface $io, string $themeName, string $clientName, string $repositoryUrl)
    {
        $readmePath = './README.md';

        try {
            if (!file_exists($readmePath)) {
                throw new \Exception("README.md file does not exist.");
            }

            $readmeContent = file_get_contents($readmePath);
            if ($readmeContent === false) {
                throw new \Exception("Unable to read README.md content.");
            }

            // Replace placeholders with actual values
            $readmeContent = str_replace('THEME_NAME', $themeName, $readmeContent);
            $readmeContent = str_replace('CLIENT_NAME', $clientName, $readmeContent);
            $readmeContent = str_replace('REPOSITORY_URL', $repositoryUrl, $readmeContent);

            // Attempt to write the updated README.md content
            if (file_put_contents($readmePath, $readmeContent) === false) {
                throw new \Exception("Failed to write updates to README.md.");
            }

            $io->write('<info>README.md has been updated.</info>');

        } catch (\Exception $e) {
            $io->write('<error>' . $e->getMessage() . '</error>');
        }
    }

    private static function updateThemeInfo(
        IOInterface $io,
        string $themeName,
        string $agencyName,
        string $agencyUrl,
        string $textDomain
    ) {
        $themeInfoPath = './style.css';

        try {
            if (!file_exists($themeInfoPath)) {
                throw new \Exception("style.css file does not exist.");
            }

            $themeInfoContent = file_get_contents($themeInfoPath);
            if ($themeInfoContent === false) {
                throw new \Exception("Unable to read style.css content.");
            }

            // Replace placeholders with actual values
            $themeInfoContent = str_replace('THEME_NAME', $themeName, $themeInfoContent);
            $themeInfoContent = str_replace('AGENCY_NAME', $agencyName, $themeInfoContent);
            $themeInfoContent = str_replace('AGENCY_URL', $agencyUrl, $themeInfoContent);
            $themeInfoContent = str_replace('TEXT_DOMAIN', $textDomain, $themeInfoContent);

            // Attempt to write the updated README.md content
            if (file_put_contents($themeInfoPath, $themeInfoContent) === false) {
                throw new \Exception("Failed to write updates to README.md.");
            }

            $io->write('<info>style.css has been updated.</info>');

        } catch (\Exception $e) {
            $io->write('<error>' . $e->getMessage() . '</error>');
        }
    }

    private static function runCommand(array $command, $io)
    {
        $process = new Process($command);
        try {
            $process->mustRun();
            $io->write("<info>Executed: " . implode(" ", $command) . "</info>");
        } catch (ProcessFailedException $exception) {
            $io->write("<error>Error executing " . implode(" ", $command) . ": " . $exception->getMessage() . "</error>");
            die;
        }
    }
}
