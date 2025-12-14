#!/usr/bin/env node
import { createClient } from '@supabase/supabase-js';
import chalk from 'chalk';
import ora from 'ora';

// 1. Initialize Supabase client
const supabaseUrl = 'https://kyuleukgrvasjenhpqdn.supabase.co';
const supabaseKey = 'sb_publishable_La1WEuSrcsKdLBOuqdMlfw_axWHf_H1'; // You said exposing API key is fine
const supabase = createClient(supabaseUrl, supabaseKey);


// 2. Get the name from command-line arguments
const args = process.argv.slice(2);
if (args.length === 0) {
  console.log(chalk.red('Usage: npx @dikhyantkrishnadalai <name>'));
  process.exit(1);
}
let name = args.join(' '); // supports multi-word names
name = name ? name : 'Dikhyant Krishna Dalai';

const spinner = ora(`Fetching resume for ${name}...`).start();

try {
  // 2. Fetch resume from Supabase
  const { data, error } = await supabase
    .from('resumes')
    .select('*')
    .eq('name', name) // Change to dynamic if needed
    .single();

  if (error) {
    spinner.fail('Failed to fetch resume.');
    console.error(error.message);
    process.exit(1);
  }

  spinner.succeed('Resume fetched!');

  // 3. Print resume
  console.log(chalk.bold.green(`\n=== ${name} ===\n`));
  console.log(chalk.blue('Email:'), data.email);
  console.log(chalk.blue('LinkedIn:'), data.linkedin);
  console.log(chalk.yellow('\nSummary:\n'), data.summary);

  console.log(chalk.cyan('\nExperience:'));
  data.experience.forEach((job, i) => {
    console.log(chalk.bold(`\n[${i + 1}] ${job.role} at ${job.company}`));
    console.log(`Duration: ${job.start} - ${job.end || 'Present'}`);
    console.log(`Description: ${job.description}`);
  });

  console.log(chalk.magenta('\nEducation:'));
  data.education.forEach((edu, i) => {
    console.log(chalk.bold(`\n[${i + 1}] ${edu.degree}, ${edu.institution}`));
    console.log(`Year: ${edu.start} - ${edu.end}`);
  });

  console.log(chalk.green('\nProjects:'));
  data.projects.forEach((project, i) => {
    console.log(chalk.bold(`\n[${i + 1}] ${project.name}`));
    console.log(`Description: ${project.description}`);
    console.log(`Link: ${project.link}`);
  });

  console.log(chalk.yellow('\nSkills:'));
  console.log(data.skills.join(', '));
} catch (err) {
  spinner.fail('Something went wrong!');
  console.error(err);
}
