import { AppItem, AppCategory, Platform } from './types';

export const localAppsData: AppItem[] = [
  {
    id: 'orion-store',
    name: 'Orion Store',
    description: 'A transparent, serverless app store powered entirely by GitHub. Built for automation, trust, and community-driven distribution.',
    icon: 'https://raw.githubusercontent.com/RookieEnough/Orion-Store/main/assets/orion_logo_512.png',
    version: '1.0.8',
    latestVersion: '1.0.8',
    downloadUrl: 'https://github.com/RookieEnough/Orion-Store/releases/latest',
    category: AppCategory.UTILITY,
    platform: Platform.ANDROID,
    size: '5.2 MB',
    author: 'RookieZ',
    screenshots: [
      'https://raw.githubusercontent.com/RookieEnough/Orion-Store/main/assets/home.PNG',
      'https://raw.githubusercontent.com/RookieEnough/Orion-Store/main/assets/dark.PNG'
    ],
    packageName: 'com.orion.store'
  }
];
