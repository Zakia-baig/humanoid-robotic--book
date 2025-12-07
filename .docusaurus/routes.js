import React from 'react';
import ComponentCreator from '@docusaurus/ComponentCreator';

export default [
  {
    path: '/__docusaurus/debug',
    component: ComponentCreator('/__docusaurus/debug', '5ff'),
    exact: true
  },
  {
    path: '/__docusaurus/debug/config',
    component: ComponentCreator('/__docusaurus/debug/config', '5ba'),
    exact: true
  },
  {
    path: '/__docusaurus/debug/content',
    component: ComponentCreator('/__docusaurus/debug/content', 'a2b'),
    exact: true
  },
  {
    path: '/__docusaurus/debug/globalData',
    component: ComponentCreator('/__docusaurus/debug/globalData', 'c3c'),
    exact: true
  },
  {
    path: '/__docusaurus/debug/metadata',
    component: ComponentCreator('/__docusaurus/debug/metadata', '156'),
    exact: true
  },
  {
    path: '/__docusaurus/debug/registry',
    component: ComponentCreator('/__docusaurus/debug/registry', '88c'),
    exact: true
  },
  {
    path: '/__docusaurus/debug/routes',
    component: ComponentCreator('/__docusaurus/debug/routes', '000'),
    exact: true
  },
  {
    path: '/docs',
    component: ComponentCreator('/docs', 'd61'),
    routes: [
      {
        path: '/docs',
        component: ComponentCreator('/docs', 'b5c'),
        routes: [
          {
            path: '/docs',
            component: ComponentCreator('/docs', '7af'),
            routes: [
              {
                path: '/docs/chapter-01/',
                component: ComponentCreator('/docs/chapter-01/', '3c7'),
                exact: true,
                sidebar: "tutorialSidebar"
              },
              {
                path: '/docs/chapter-02/',
                component: ComponentCreator('/docs/chapter-02/', '6d7'),
                exact: true,
                sidebar: "tutorialSidebar"
              },
              {
                path: '/docs/chapter-03/',
                component: ComponentCreator('/docs/chapter-03/', '23a'),
                exact: true,
                sidebar: "tutorialSidebar"
              },
              {
                path: '/docs/chapter-04/',
                component: ComponentCreator('/docs/chapter-04/', '516'),
                exact: true,
                sidebar: "tutorialSidebar"
              },
              {
                path: '/docs/chapter-05/',
                component: ComponentCreator('/docs/chapter-05/', '3db'),
                exact: true,
                sidebar: "tutorialSidebar"
              },
              {
                path: '/docs/chapter-06/',
                component: ComponentCreator('/docs/chapter-06/', '572'),
                exact: true,
                sidebar: "tutorialSidebar"
              },
              {
                path: '/docs/chapter-07/',
                component: ComponentCreator('/docs/chapter-07/', '3e7'),
                exact: true,
                sidebar: "tutorialSidebar"
              },
              {
                path: '/docs/chapter-08/',
                component: ComponentCreator('/docs/chapter-08/', 'e3b'),
                exact: true,
                sidebar: "tutorialSidebar"
              },
              {
                path: '/docs/chapter-09/',
                component: ComponentCreator('/docs/chapter-09/', 'cd0'),
                exact: true,
                sidebar: "tutorialSidebar"
              },
              {
                path: '/docs/chapter-10/',
                component: ComponentCreator('/docs/chapter-10/', 'b0e'),
                exact: true,
                sidebar: "tutorialSidebar"
              },
              {
                path: '/docs/chapter-11/',
                component: ComponentCreator('/docs/chapter-11/', '0b2'),
                exact: true,
                sidebar: "tutorialSidebar"
              },
              {
                path: '/docs/chapter-12/',
                component: ComponentCreator('/docs/chapter-12/', '2b0'),
                exact: true,
                sidebar: "tutorialSidebar"
              },
              {
                path: '/docs/chapter-13/',
                component: ComponentCreator('/docs/chapter-13/', '639'),
                exact: true,
                sidebar: "tutorialSidebar"
              },
              {
                path: '/docs/contributing/authoring-guidelines',
                component: ComponentCreator('/docs/contributing/authoring-guidelines', '1f0'),
                exact: true,
                sidebar: "tutorialSidebar"
              },
              {
                path: '/docs/contributing/content-management',
                component: ComponentCreator('/docs/contributing/content-management', '242'),
                exact: true,
                sidebar: "tutorialSidebar"
              },
              {
                path: '/docs/intro',
                component: ComponentCreator('/docs/intro', '61d'),
                exact: true,
                sidebar: "tutorialSidebar"
              },
              {
                path: '/docs/quickstart',
                component: ComponentCreator('/docs/quickstart', '79e'),
                exact: true,
                sidebar: "tutorialSidebar"
              }
            ]
          }
        ]
      }
    ]
  },
  {
    path: '/',
    component: ComponentCreator('/', '2e1'),
    exact: true
  },
  {
    path: '*',
    component: ComponentCreator('*'),
  },
];
