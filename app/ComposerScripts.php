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
        $io->write("Setting up your Sage project...");

        // Call setup methods for theme and static boilerplates
        self::setupStaticBoilerplate($io);
        self::setupThemeBoilerplate($io);

        // Prompt the user for the repository URL
        $repositoryUrl = $io->ask('Please enter the Git repository URL: ');

        // Continue only if the URL is provided
        if (!empty($repositoryUrl)) {
            $io->write("Setting up your Sage project with repository: $repositoryUrl");

            // Initialize Git, add remote, and perform other tasks
            self::initializeGitRepository($repositoryUrl, $io);
        } else {
            $io->write('No repository URL provided, skipping Git setup.');
        }

        self::installPackages($event);
        self::buildAssets($event);
    }

    public static function setupStaticBoilerplate(IOInterface $io)
    {
        $io->write("<info>Cloning the ssm-static-boilerplate repository...</info>");

        self::runCommand([
            'git',
            'clone',
            'https://github.com/secretstache/ssm-static-boilerplate',
            'static'
        ], $io);

        $io->write("<info>Static boilerplate setup complete.</info>");
    }

    public static function setupThemeBoilerplate(IOInterface $io)
    {
        $io->write("<info>Cloning the ssm-theme-boilerplate repository...</info>");

        self::runCommand([
            'git',
            'clone',
            '-b',
            'prepare-release-3.2.0', // Use the actual branch name
            'https://github.com/secretstache/ssm-theme-boilerplate',
            'theme-boilerplate'
        ], $io);

        $io->write("<info>Running wp acorn ssm:setup...</info>");

        self::runCommand(['wp', 'acorn', 'ssm:setup'], $io);

        $io->write("<info>Theme boilerplate setup complete.</info>");
    }

    private static function initializeGitRepository(String $repositoryUrl, IOInterface $io)
    {
        $io->write("<info>Init repository...</info>");
        self::runCommand(['git', 'init'], $io);

        $io->write("<info>Add remote origin...</info>");
        self::runCommand(['git', 'remote', 'add', 'origin', $repositoryUrl], $io);

        $io->write("<info>Commit Changes...</info>");
        self::runCommand(['git', 'add', '.'], $io);
        self::runCommand(['git', 'commit', '-m', 'Initial commit'], $io);

        self::runCommand(['git', 'branch', '-M', 'master'], $io);

        $io->write("<info>Create a static branch based on master...</info>");
        self::runCommand(['git', 'checkout', '-b', 'static'], $io);

        // It's important to push the 'master' branch before switching away from it, especially if it's the first push.
        $io->write("<info>Push master to the repository...</info>");
        self::runCommand(['git', 'push', '-u', 'origin', 'master'], $io);

        // After pushing 'master', you're now on 'static' and can push it as well.
        $io->write("<info>Push static to the repository...</info>");
        self::runCommand(['git', 'push', '-u', 'origin', 'static'], $io);

        $io->write("<info>Switching back to master branch...</info>");
        self::runCommand(['git', 'checkout', 'master'], $io);

        $io->write("<info>Success.</info>");
    }

    public static function installPackages(IOInterface $io)
    {
        $io->write("<info>Install npm dependencies.</info>");

        self::runCommand([
            'yarn',
            'install',
        ], $io);

        $io->write("<info>Success.</info>");
    }

    public static function buildAssets(IOInterface $io)
    {
        $io->write("<info>Build assets.</info>");

        self::runCommand([
            'yarn',
            'build',
        ], $io);

        $io->write("<info>Success.</info>");
    }

    private static function runCommand(array $command, $io)
    {
        $process = new Process($command);
        try {
            $process->mustRun();
            $io->write("<info>Executed: " . implode(" ", $command) . "</info>");
        } catch (ProcessFailedException $exception) {
            $io->write("<error>Error executing " . implode(" ", $command) . ": " . $exception->getMessage() . "</error>");
        }
    }
}

