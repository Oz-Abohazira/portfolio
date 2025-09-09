// Project data structure for the code-driven narrative portfolio
// This file centralizes all project information and makes it easy to add new projects

import { Project } from '@/types';

// Main projects data - based on professional experience
export const projects: Project[] = [
  {
    id: 'monitoring-system',
    name: 'Centralized System Monitoring Application',
    status: 'completed',
    description: 'Designed and implemented a centralized monitoring application that tracked every site and device, generated automated reports, and provided real-time system health statistics across the state.',
    technologies: ['Python', 'System Monitoring', 'Automated Reports', 'Real-time Analytics', 'Network Configuration', 'Health Statistics'],
    debugCommand: 'show --monitoring-system',
    codeSnippet: `
def validate_time_format(time_str):
    """Validate time format (HH:MM in 24-hour format) for single or comma-separated times"""
    times = [t.strip() for t in time_str.split(',')]
    pattern = r'^([01]?[0-9]|2[0-3]):([0-5][0-9])$'
    return all(bool(re.match(pattern, time)) for time in times)


def setup_scheduler():
    """Setup the daily scheduler with multiple times"""
    global SCHEDULE_ENABLED, SCHEDULE_JOBS
    if SCHEDULE_ENABLED and EMAIL_CONFIG:
        # Clear existing schedules and job tracking
        schedule.clear()
        SCHEDULE_JOBS.clear()

        # Get scheduled times from config, default to 17:30 if not set
        scheduled_times = EMAIL_CONFIG.get('scheduled_time', '17:30')

        # Split comma-separated times
        times_list = [t.strip() for t in scheduled_times.split(',')]

        # Validate and schedule each time
        valid_times = []
        for time_str in times_list:
            if validate_time_format(time_str):
                valid_times.append(time_str)
                # Create unique job identifier to prevent duplicates
                job_id = f"daily_report_{time_str.replace(':', '')}"
                if job_id not in SCHEDULE_JOBS:
                    job = schedule.every().day.at(time_str).do(generate_scheduled_report_wrapper, time_str)
                    SCHEDULE_JOBS[job_id] = job
            else:
                print(f"Invalid time format '{time_str}', skipping")

        if valid_times:
            print(f"Scheduler configured for daily reports at: {', '.join(valid_times)}")
        else:
            print("No valid times configured, using default 17:30")
            job = schedule.every().day.at('17:30').do(generate_scheduled_report_wrapper, '17:30')
            SCHEDULE_JOBS['daily_report_1730'] = job


def run_scheduler():
    """Run the scheduler in a separate thread with better control"""
    global SCHEDULE_ENABLED
    last_minute = None

    while SCHEDULE_ENABLED:
        try:
            current_minute = datetime.now().strftime('%H:%M')

            # Only run pending jobs once per minute
            if current_minute != last_minute:
                schedule.run_pending()
                last_minute = current_minute

            threading.Event().wait(30)  # Check every 30 seconds instead of 60

        except Exception as e:
            print(f"Scheduler error: {e}")
            threading.Event().wait(60)`,
    completionPercentage: 100,
    images: [
      'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNDAwIiBoZWlnaHQ9IjMwMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cmVjdCB3aWR0aD0iMTAwJSIgaGVpZ2h0PSIxMDAlIiBmaWxsPSIjMWExYTFhIi8+PHRleHQgeD0iNTAlIiB5PSI1MCUiIGZvbnQtZmFtaWx5PSJtb25vc3BhY2UiIGZvbnQtc2l6ZT0iMjQiIGZpbGw9IiMwMGZmODgiIHRleHQtYW5jaG9yPSJtaWRkbGUiIGR5PSIuM2VtIj5Db21pbmcgU29vbjwvdGV4dD48L3N2Zz4=', // Dashboard screenshot
      'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNDAwIiBoZWlnaHQ9IjMwMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cmVjdCB3aWR0aD0iMTAwJSIgaGVpZ2h0PSIxMDAlIiBmaWxsPSIjMWExYTFhIi8+PHRleHQgeD0iNTAlIiB5PSI1MCUiIGZvbnQtZmFtaWx5PSJtb25vc3BhY2UiIGZvbnQtc2l6ZT0iMjQiIGZpbGw9IiMwMGZmODgiIHRleHQtYW5jaG9yPSJtaWRkbGUiIGR5PSIuM2VtIj5Db21pbmcgU29vbjwvdGV4dD48L3N2Zz4=', // Reports interface
      'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNDAwIiBoZWlnaHQ9IjMwMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cmVjdCB3aWR0aD0iMTAwJSIgaGVpZ2h0PSIxMDAlIiBmaWxsPSIjMWExYTFhIi8+PHRleHQgeD0iNTAlIiB5PSI1MCUiIGZvbnQtZmFtaWx5PSJtb25vc3BhY2UiIGZvbnQtc2l6ZT0iMjQiIGZpbGw9IiMwMGZmODgiIHRleHQtYW5jaG9yPSJtaWRkbGUiIGR5PSIuM2VtIj5Db21pbmcgU29vbjwvdGV4dD48L3N2Zz4='  // System monitoring view
    ]
  },
  
  {
    id: 'sitekick-website-generator',
    name: 'Websites Generation and Deployment',
    status: 'completed',
    description: 'A Comprehensive backend API for generating and managing multi-page websites for local service businesses. Sitekick automatically creates professional websites with location-specific content, service pages, contact forms and admin controls with a powerful multi-template system and advanced google SEO optimizations.',
    technologies: ['Node.js', 'Express.js', 'Vercel API', 'HTML5/CSS3', 'JavaScript ES6+', 'SMTP Integration', 'Template Engine', 'SEO Optimization'],
    debugCommand: 'show --sitekick-website-generator',
    codeSnippet: `
// Initialize Vercel API client
function initializeVercelAPI() {
  const vercelConfig = getVercelConfig();
  const VERCEL_API_TOKEN = vercelConfig.VERCEL_API_TOKEN;
  const TEAM_ID = vercelConfig.TEAM_ID;
  
  if (!VERCEL_API_TOKEN || !TEAM_ID) {
    throw new Error(
      "Missing Vercel API token or Team ID. Please set VERCEL_API_TOKEN and TEAM_ID in your environment."
    );
  }
  
  vercelAPI = axios.create({
    baseURL: "https://api.vercel.com",
    headers: {
      Authorization: 'Bearer $\{VERCEL_API_TOKEN\}',
      "Content-Type": "application/json",
    },
  });
  
  return { VERCEL_API_TOKEN, TEAM_ID };
}
/**
 * Generate site configuration for a given subdomain and city
 */
function generateSiteConfig(subdomain, city, state, business_name) {
  // Get unique content variations for this site
  const uniqueContent = generateUniqueContent(city, subdomain);

  // Return the site configuration with all pages
  return {
    subdomain: subdomain,
    city: city,
    state: state,
    business_name: business_name,
    uniqueContent: uniqueContent
  };
}
  function generateSitemap(baseUrl, city, state, business_name, logoUrl) {
  const currentDate = new Date().toISOString();

  return \`<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"
        xmlns:image="http://www.google.com/schemas/sitemap-image/1.1"
        xmlns:news="http://www.google.com/schemas/sitemap-news/0.9"
        xmlns:xhtml="http://www.w3.org/1999/xhtml">

    <!-- Homepage - Highest Priority -->
    <url>
        <loc>\${baseUrl}/</loc>
        <lastmod>\${currentDate}</lastmod>
        <changefreq>weekly</changefreq>
        <priority>1.0</priority>
        <image:image>
            <image:loc>\${logoUrl || "https:// \`
`,
    completionPercentage: 100,
    images: [
      'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNDAwIiBoZWlnaHQ9IjMwMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cmVjdCB3aWR0aD0iMTAwJSIgaGVpZ2h0PSIxMDAlIiBmaWxsPSIjMWExYTFhIi8+PHRleHQgeD0iNTAlIiB5PSI1MCUiIGZvbnQtZmFtaWx5PSJtb25vc3BhY2UiIGZvbnQtc2l6ZT0iMjQiIGZpbGw9IiMwMGZmODgiIHRleHQtYW5jaG9yPSJtaWRkbGUiIGR5PSIuM2VtIj5Db21pbmcgU29vbjwvdGV4dD48L3N2Zz4=', // API dashboard
      'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNDAwIiBoZWlnaHQ9IjMwMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cmVjdCB3aWR0aD0iMTAwJSIgaGVpZ2h0PSIxMDAlIiBmaWxsPSIjMWExYTFhIi8+PHRleHQgeD0iNTAlIiB5PSI1MCUiIGZvbnQtZmFtaWx5PSJtb25vc3BhY2UiIGZvbnQtc2l6ZT0iMjQiIGZpbGw9IiMwMGZmODgiIHRleHQtYW5jaG9yPSJtaWRkbGUiIGR5PSIuM2VtIj5Db21pbmcgU29vbjwvdGV4dD48L3N2Zz4=', // Template system
      'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNDAwIiBoZWlnaHQ9IjMwMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cmVjdCB3aWR0aD0iMTAwJSIgaGVpZ2h0PSIxMDAlIiBmaWxsPSIjMWExYTFhIi8+PHRleHQgeD0iNTAlIiB5PSI1MCUiIGZvbnQtZmFtaWx5PSJtb25vc3BhY2UiIGZvbnQtc2l6ZT0iMjQiIGZpbGw9IiMwMGZmODgiIHRleHQtYW5jaG9yPSJtaWRkbGUiIGR5PSIuM2VtIj5Db21pbmcgU29vbjwvdGV4dD48L3N2Zz4='  // Deployment interface
    ]
  },

  {
    id: 'mobile-crm',
    name: 'Mobile CRM Business App',
    status: 'in-progress',
    description: 'A comprehensive mobile CRM application for small businesses to manage customer relationships, track leads, and streamline sales processes. Built with React Native for cross-platform compatibility and PostgreSQL for robust data management.',
    technologies: ['React Native', 'PostgreSQL', 'Node.js', 'Express.js', 'TypeScript', 'Mobile Development', 'Cross-platform'],
    debugCommand: 'show --mobile-crm',
    codeSnippet: `
import React, { useState, useEffect } from 'react';
import { View, Text, FlatList, StyleSheet } from 'react-native';

interface Customer {
  id: string;
  name: string;
  email: string;
  status: 'lead' | 'customer' | 'inactive';
}

export const CustomerList = () => {
  const [customers, setCustomers] = useState<Customer[]>([]);

  useEffect(() => {
    fetchCustomers();
  }, []);

  const fetchCustomers = async () => {
    try {
      const response = await fetch('http://localhost:3000/api/customers');
      const data = await response.json();
      setCustomers(data);
    } catch (error) {
      console.error('Error fetching customers:', error);
    }
  };

  const renderCustomer = ({ item }: { item: Customer }) => {
    return (
      // Customer card component would be rendered here
      // Using React.createElement instead of JSX for template literal compatibility
      React.createElement(View, { style: styles.customerCard }, [
        React.createElement(Text, { style: styles.customerName, key: 'name' }, item.name),
        React.createElement(Text, { style: styles.customerEmail, key: 'email' }, item.email),
        React.createElement(Text, { style: styles.status, key: 'status' }, item.status.toUpperCase())
      ])
    );
  };

  return (
    React.createElement(View, { style: styles.container }, [
      React.createElement(Text, { style: styles.title, key: 'title' }, 'Customer Management'),
      React.createElement(FlatList, {
        data: customers,
        renderItem: renderCustomer,
        keyExtractor: (item: Customer) => item.id,
        key: 'list'
      })
    ])
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20 },
  title: { fontSize: 24, fontWeight: 'bold', marginBottom: 20 },
  customerCard: { padding: 15, marginVertical: 5, backgroundColor: '#f5f5f5', borderRadius: 8 },
  customerName: { fontSize: 18, fontWeight: 'bold' },
  customerEmail: { fontSize: 14, color: '#666' },
  status: { fontSize: 12, fontWeight: 'bold', marginTop: 5 }
});`,
    completionPercentage: 15
  }
];

// Available debug commands
export const debugCommands = [
  'show --commands',
  'show --help',
  'show --about',
  'show --skills',
  'show --contact',
  ...projects.map(p => p.debugCommand.replace('debug', 'show')),
  '--clear',
  'reset-progress',
  'show --history'
];

// Command descriptions for help output
export const commands = [
  { command: 'show --about', description: 'View personal information and bio' },
  { command: 'show --skills', description: 'View technical skills and expertise' },
  { command: 'show --contact', description: 'View contact information' },
  ...projects.map(p => ({ 
    command: p.debugCommand.replace('debug', 'show'), 
    description: `View ${p.name} project details` 
  })),
  { command: '--clear', description: 'Clear terminal and reset to initial state' },
  { command: 'reset-progress', description: 'Reset puzzle and contact challenge progress' },
  { command: 'show --help', description: 'Display available commands' }
];

// Personal information (easily customizable)
export const personalInfo = {
  name: 'Oz Abohazira',
  title: 'Full Stack Software Developer',
  bio: 'Results-driven software developer with 9+ years of experience delivering high-impact solutions across web, enterprise, and system environments. Skilled in full-stack development, process automation, and complex system integration, with a proven record of reducing operational timelines, optimizing workflows, and building custom tools that improve efficiency.',
  location: 'Dunwoody, GA 30338',
  phone: '470 784 9378',
  skills: {
    'Frontend Technologies': [
      'Vanilla JavaScript',
      'TypeScript',
      'React',
      'Angular',
      'HTML/CSS/SCSS',
      'Bootstrap',
      'Tailwind CSS'
    ],
    'Backend Development': [
      'REST API',
      'Serverless Applications',
      'Next.js',
      'Python',
      'C# and .NET',
      'Java',
      'Node.js'
    ],
    'Database & Storage': [
      'MongoDB',
      'Firebase',
    ],
    'Integration & Tools': [
      'System Monitoring',
      'Process Automation',
      'Networking',
      'Git',
      'Jira',
    ],
    'Leadership & Management': [
      'Project Management',
      'Team Leadership',
      'Staff Training',
      'Problem Solving'
    ]
  },
  contact: {
    email: 'ozabohaziradev@gmail.com',
    linkedin: 'https://www.linkedin.com/in/oz-abohazira-86812119a',
    github: 'https://github.com/oz-abohazira',
    portfolio: 'https://ozabohazira.dev'
  }
};
