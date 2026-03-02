import { AppItem, AppCategory, Platform } from './types';

export const localAppsData: AppItem[] = [
  {
    id: 'pretub-store',
    name: 'Pretub Store',
    description: 'A transparent, serverless app store powered entirely by GitHub. Built for automation, trust, and community-driven distribution.',
    icon: 'assets/pretub-icon.png',
    version: '1.0.8',
    latestVersion: '1.0.8',
    downloadUrl: 'https://github.com/Jeewantha97Rashmika/Orion-Store/releases/latest',
    category: AppCategory.UTILITY,
    platform: Platform.ANDROID,
    size: '5.2 MB',
    author: 'RookieZ',
    screenshots: [
      'assets/home.PNG',
      'assets/dark.PNG'
    ],
    packageName: 'com.pretub.store'
  }
];
