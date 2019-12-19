#!/usr/bin/env node
// console.log('wai 脚手架工具');
const program = require('commander');
const download = require('download-git-repo');
const handlebars = require('handlebars');
const inquirer = require('inquirer');
const fs = require('fs');
const ora = require('ora');
const chalk = require('chalk');
const logSymbol = require('log-symbols');
program.version('0.1.0').option('-C, --chdir <path>', 'change the working directory');
const templates = {
    MA: {
        url: 'https://github.com/waihoyu/template_a',
        downloadUrl: 'https://github.com:waihoyu/template_a#master',
        description: 'M站客户端A模版',
    },
    MB: {
        url: 'https://github.com/waihoyu/template_b',
        downloadUrl: 'https://github.com:waihoyu/template_b#master',
        description: 'M站服务端B模版',
    },
};
program
    .command('init <template> <project>')
    .description('初始化项目模板')
    .option('-s, --setup_mode[mode]', 'which setup ')
    .action(function(templateName, projectName) {
        // console.log(env, options);
        // console.log(templates[templateName]);
        const spinner = ora('正在下载.....').start();
        const { downloadUrl } = templates[templateName];
        download(downloadUrl, projectName, { clone: true }, err => {
            if (err) {
                spinner.fail();
                console.log(chalk.red('初始化失败'));
                return;
            }
            spinner.succeed();
            inquirer
                .prompt([
                    {
                        type: 'input',
                        name: 'name',
                        message: '请输入项目名称',
                    },
                    {
                        type: 'input',
                        name: 'description',
                        message: '请输入项目简介',
                    },
                    {
                        type: 'input',
                        name: 'author',
                        message: '请输入作者名称',
                    },
                ])
                .then(answers => {
                    const packagePath = `${projectName}/package.json`;
                    const packageContent = fs.readFileSync(packagePath, 'utf8');
                    const packageResult = handlebars.compile(packageContent)(answers);
                    fs.writeFileSync(packagePath, packageResult);
                    console.log(chalk.green('初始化模版成功'));
                });
            // else {
            //     console.log('下载成功');
            // }
        });
    });
program
    .command('list')
    .description('查看所有可用模版')
    .action(() => {
        for (const key in templates) {
            console.log(`
           ${key}  ${templates[key].description}
           `);
        }
    });
program.parse(process.argv);
