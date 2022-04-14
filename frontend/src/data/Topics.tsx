import {
  Science as ScienceIcon,
  Memory as TechIcon,
  Restaurant as FoodIcon,
} from '@mui/icons-material';

export type Topic = {
  icon: any;
  category: string;
  subTopics: string[];
};

const topics: Topic[] = [
  {
    icon: (
      <ScienceIcon
        style={{ marginTop: -3, paddingRight: 10, width: 19, height: 19 }}
      />
    ),
    category: 'Science',
    subTopics: ['', 'Computer Science', 'Physics', 'Biology', 'Astronomy'],
  },
  {
    icon: (
      <TechIcon
        style={{ marginTop: -3, paddingRight: 10, width: 19, height: 19 }}
      />
    ),
    category: 'Technology',
    subTopics: [
      '',
      'Electronics',
      'Smartphones',
      'Software',
      'Artificial Intelligence',
    ],
  },
  {
    icon: (
      <FoodIcon
        style={{ marginTop: -3, paddingRight: 10, width: 19, height: 19 }}
      />
    ),
    category: 'Food',
    subTopics: ['', 'Baking', 'Cooking', 'Recipes'],
  },
];

export default topics;
