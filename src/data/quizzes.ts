export type Question = { q: string; options: string[]; answer: number; why: string };

// Keyed by module slug.
export const QUIZZES: Record<string, Question[]> = {
  foundations: [
    {
      q: "What is a model in machine learning?",
      options: [
        "A set of rules learned from data",
        "A spreadsheet of training examples",
        "A program written rule by rule by a person",
        "A chart of the results",
      ],
      answer: 0,
      why: "A model is what the computer learns from examples: a recipe turning inputs into outputs.",
    },
    {
      q: "You predict house prices from size and age. What is the label?",
      options: ["Size", "Age", "Price", "The address"],
      answer: 2,
      why: "The label is the answer you want predicted. Size and age are features.",
    },
    {
      q: "Why keep a test set hidden during training?",
      options: [
        "To make training faster",
        "To check the model on data it has never seen",
        "To save storage space",
        "To add more features",
      ],
      answer: 1,
      why: "Only unseen data shows whether the model learned or simply memorised.",
    },
    {
      q: "A model scores 99% on training data and 60% on test data. This is…",
      options: ["Underfitting", "Overfitting", "Clustering", "A perfect model"],
      answer: 1,
      why: "Great in training, poor on new data: the model memorised. That is overfitting.",
    },
  ],
  "linear-regression": [
    {
      q: "Linear regression is used to predict…",
      options: ["A category", "A number", "A cluster", "An image"],
      answer: 1,
      why: "Regression means predicting a numeric value.",
    },
    {
      q: "Why does mean squared error square each gap?",
      options: [
        "To make gaps positive and punish big mistakes more",
        "To make the maths slower",
        "To ignore large errors",
        "To turn numbers into categories",
      ],
      answer: 0,
      why: "Squaring removes the sign and weighs large errors heavily.",
    },
    {
      q: "What happens when the learning rate is far too large?",
      options: [
        "Training is slow but safe",
        "Nothing changes",
        "Steps overshoot and the error can grow",
        "The model gets more features",
      ],
      answer: 2,
      why: "Huge steps jump over the valley, so the error bounces or explodes.",
    },
    {
      q: "In prediction = slope × input + intercept, the slope tells you…",
      options: [
        "The prediction when the input is zero",
        "How much the output changes when the input grows by one",
        "The total error",
        "The number of data points",
      ],
      answer: 1,
      why: "The slope is the change in output per unit of input. The intercept is the value at zero.",
    },
  ],
  classification: [
    {
      q: "Which task is classification?",
      options: [
        "Predicting tomorrow's temperature",
        "Deciding whether an email is spam",
        "Estimating a house price",
        "Forecasting sales totals",
      ],
      answer: 1,
      why: "Spam or not spam is a category. The others are numbers.",
    },
    {
      q: "In KNN with k = 5, a new point is labelled by…",
      options: [
        "The single closest point",
        "A vote among its 5 closest points",
        "The average of all points",
        "A random choice",
      ],
      answer: 1,
      why: "The k nearest neighbours vote and the majority wins.",
    },
    {
      q: "Logistic regression outputs…",
      options: ["A probability between 0 and 1", "Any number", "A cluster centre", "A tree"],
      answer: 0,
      why: "The sigmoid squeezes the result into the range 0 to 1.",
    },
    {
      q: "99 of 100 patients are healthy. A model that always says healthy has…",
      options: [
        "High accuracy and high recall for illness",
        "High accuracy but zero recall for illness",
        "Low accuracy",
        "Perfect precision and recall",
      ],
      answer: 1,
      why: "It is 99% accurate yet catches none of the ill patients.",
    },
  ],
  "decision-trees": [
    {
      q: "How does a decision tree make a prediction?",
      options: [
        "By drawing a straight line",
        "By following yes or no questions to a leaf",
        "By averaging all the data",
        "By voting among neighbours",
      ],
      answer: 1,
      why: "Each question sends you down a branch until a leaf gives the answer.",
    },
    {
      q: "A Gini impurity of 0 means a group…",
      options: [
        "Is evenly mixed",
        "Contains only one class",
        "Is empty",
        "Has too many features",
      ],
      answer: 1,
      why: "Zero impurity means perfectly pure: one class only.",
    },
    {
      q: "Why limit the depth of a tree?",
      options: [
        "To stop it memorising the training data",
        "To use more memory",
        "To make it less readable",
        "To add more labels",
      ],
      answer: 0,
      why: "A very deep tree overfits; a depth limit keeps it general.",
    },
    {
      q: "A random forest is…",
      options: [
        "One very deep tree",
        "Many trees trained on random samples that vote",
        "A clustering method",
        "A type of neural network",
      ],
      answer: 1,
      why: "Many varied trees vote, which cancels out individual mistakes.",
    },
  ],
  clustering: [
    {
      q: "Clustering is an example of…",
      options: [
        "Supervised learning",
        "Unsupervised learning",
        "Regression",
        "Reinforcement learning",
      ],
      answer: 1,
      why: "There are no labels; the algorithm finds groups alone.",
    },
    {
      q: "Which two steps does K-means repeat?",
      options: [
        "Split and prune",
        "Assign points to the nearest centre, then move the centres",
        "Predict and backpropagate",
        "Shuffle and sort",
      ],
      answer: 1,
      why: "Assign, then update the centres, until nothing changes.",
    },
    {
      q: "In K-means, what does k stand for?",
      options: [
        "The number of clusters",
        "The number of features",
        "The learning rate",
        "The number of data points",
      ],
      answer: 0,
      why: "You choose k, the number of groups, before running it.",
    },
    {
      q: "The elbow method helps you choose…",
      options: ["The learning rate", "A good number of clusters", "The test set size", "The activation"],
      answer: 1,
      why: "The bend in the tightness curve suggests a sensible k.",
    },
  ],
  "neural-networks": [
    {
      q: "What does a single neuron compute?",
      options: [
        "A weighted sum passed through an activation function",
        "The average of the labels",
        "A decision tree",
        "The distance to a cluster centre",
      ],
      answer: 0,
      why: "Inputs times weights, added up, then through an activation.",
    },
    {
      q: "Why do networks need activation functions?",
      options: [
        "To run faster",
        "So stacked layers can learn curved, non-linear shapes",
        "To reduce the number of weights",
        "To label the data",
      ],
      answer: 1,
      why: "Without them, any number of layers still equals one straight line.",
    },
    {
      q: "Backpropagation is used to…",
      options: [
        "Split data into train and test",
        "Work out how each weight should change to lower the error",
        "Choose the number of layers",
        "Draw the decision boundary",
      ],
      answer: 1,
      why: "It passes the error backwards so every weight knows its share.",
    },
    {
      q: "One epoch is…",
      options: [
        "One neuron firing",
        "One full pass over the training data",
        "One hidden layer",
        "One weight update",
      ],
      answer: 1,
      why: "An epoch is a complete pass through all training examples.",
    },
  ],
};
