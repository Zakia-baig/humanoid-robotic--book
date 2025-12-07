// @ts-check

/** @type {import('@docusaurus/plugin-content-docs').SidebarsConfig} */
const sidebars = {
  tutorialSidebar: [
    {
      type: 'category',
      label: 'Humanoid Robotics Book',
      items: [
        'intro',
        {
          type: 'category',
          label: 'Chapter 1 - Introduction to Humanoid Robotics',
          items: [
            'chapter-01/index',
          ],
        },
        {
          type: 'category',
          label: 'Chapter 2 - Physical AI Fundamentals',
          items: [
            'chapter-02/index',
          ],
        },
        {
          type: 'category',
          label: 'Chapter 3 - ROS2 for Humanoid Robots',
          items: [
            'chapter-03/index',
          ],
        },
        {
          type: 'category',
          label: 'Chapter 4 - Gazebo Simulation Environment',
          items: [
            'chapter-04/index',
          ],
        },
        {
          type: 'category',
          label: 'Chapter 5 - Isaac Robotics Platform',
          items: [
            'chapter-05/index',
          ],
        },
        {
          type: 'category',
          label: 'Chapter 6 - Vision Language Action (VLA) Models',
          items: [
            'chapter-06/index',
          ],
        },
        {
          type: 'category',
          label: 'Chapter 7 - Locomotion and Movement Control',
          items: [
            'chapter-07/index',
          ],
        },
        {
          type: 'category',
          label: 'Chapter 8 - Perception Systems',
          items: [
            'chapter-08/index',
          ],
        },
        {
          type: 'category',
          label: 'Chapter 9 - Manipulation and Grasping',
          items: [
            'chapter-09/index',
          ],
        },
        {
          type: 'category',
          label: 'Chapter 10 - Human-Robot Interaction',
          items: [
            'chapter-10/index',
          ],
        },
        {
          type: 'category',
          label: 'Chapter 11 - Control Systems and Planning',
          items: [
            'chapter-11/index',
          ],
        },
        {
          type: 'category',
          label: 'Chapter 12 - AI and Learning in Humanoid Robots',
          items: [
            'chapter-12/index',
          ],
        },
        {
          type: 'category',
          label: 'Chapter 13 - Future Directions and Applications',
          items: [
            'chapter-13/index',
          ],
        },
        {
          type: 'category',
          label: 'Contributing',
          items: [
            'contributing/content-management',
            'contributing/authoring-guidelines',
          ],
        },
        'quickstart',
      ],
    },
  ],
};

module.exports = sidebars;