export type Lesson = { title: string; minutes: number; body: string[]; takeaway: string };
export type Module = {
  slug: string;
  number: string;
  title: string;
  summary: string;
  level: "Beginner" | "Intermediate";
  lessons: Lesson[];
  practice: { label: string; to: "/visualizer" | "/playground" | "/datasets" };
};

export const MODULES: Module[] = [
  {
    slug: "foundations",
    number: "01",
    title: "What machine learning is",
    summary: "How a computer learns from examples instead of following hand-written rules.",
    level: "Beginner",
    practice: { label: "Browse real datasets", to: "/datasets" },
    lessons: [
      {
        title: "Learning from examples",
        minutes: 5,
        body: [
          "A traditional program follows rules a person wrote: if the email contains this word, mark it as spam. Machine learning flips that around. You show the computer thousands of emails already marked spam or not spam, and it works out the rules by itself.",
          "The result is called a model. It is simply a recipe, learned from data, that turns an input (an email) into an output (spam or not).",
        ],
        takeaway: "A model is a set of rules learned from examples, not written by hand.",
      },
      {
        title: "Features and labels",
        minutes: 6,
        body: [
          "Each example is described by features: the measurable facts about it. For a house these might be its size, number of rooms and age. The label is the answer you want the model to predict, such as the price.",
          "When every example comes with a label, it is called supervised learning. When there are no labels and the model has to find structure alone, it is unsupervised learning.",
        ],
        takeaway: "Features are the inputs, the label is the answer. Labels present means supervised.",
      },
      {
        title: "Training and testing",
        minutes: 6,
        body: [
          "If you check a model on the same examples it studied, it looks better than it really is, like a student who saw the exam beforehand. So the data is split: most of it for training, the rest kept hidden for testing.",
          "A model that does well in training but badly on the test set has memorised instead of learned. This is called overfitting, and it is the most common trap in machine learning.",
        ],
        takeaway: "Always judge a model on data it has never seen.",
      },
    ],
  },
  {
    slug: "linear-regression",
    number: "02",
    title: "Linear regression",
    summary: "Draw the best straight line through your data and use it to predict numbers.",
    level: "Beginner",
    practice: { label: "Watch a line fit itself", to: "/visualizer" },
    lessons: [
      {
        title: "A line that predicts",
        minutes: 5,
        body: [
          "Regression means predicting a number. Linear regression does it with a straight line: prediction = slope × input + intercept. The slope says how much the output grows when the input grows by one.",
          "With more than one feature the line becomes a flat surface, but the idea stays the same: every feature gets its own weight.",
        ],
        takeaway: "Linear regression learns one weight per feature plus an intercept.",
      },
      {
        title: "Measuring error",
        minutes: 6,
        body: [
          "To find the best line we need a way to score a line. For each point, take the gap between the real value and the predicted one, square it, and average over all points. That is the mean squared error.",
          "Squaring makes every gap positive and punishes big mistakes much more than small ones.",
        ],
        takeaway: "The best line is the one with the lowest mean squared error.",
      },
      {
        title: "Gradient descent",
        minutes: 8,
        body: [
          "Picture the error as a hilly landscape where each spot is a different line. Gradient descent starts somewhere at random, feels which way is downhill, and takes a small step in that direction. Repeat, and you slide into the valley.",
          "The size of each step is the learning rate. Too small and training crawls. Too large and you jump over the valley and the error grows instead of shrinking.",
        ],
        takeaway: "Gradient descent improves a model step by step; the learning rate sets the step size.",
      },
    ],
  },
  {
    slug: "classification",
    number: "03",
    title: "Classification",
    summary: "Sort things into groups: spam or not, cat or dog, healthy or ill.",
    level: "Beginner",
    practice: { label: "Try nearest neighbours", to: "/visualizer" },
    lessons: [
      {
        title: "Predicting a category",
        minutes: 5,
        body: [
          "Classification predicts which group something belongs to. With two groups it is binary classification; with more it is multi-class.",
          "You can imagine the model drawing a border through the data. Everything on one side gets one answer, everything on the other side gets the other. That border is the decision boundary.",
        ],
        takeaway: "A classifier draws a decision boundary between groups.",
      },
      {
        title: "K-nearest neighbours",
        minutes: 6,
        body: [
          "The simplest classifier has no training at all. To label a new point, find the k closest points you already know and let them vote.",
          "A small k follows every wiggle in the data and is easily fooled by an odd point. A large k gives smoother, calmer answers but can blur real detail.",
        ],
        takeaway: "KNN labels a point by a vote among its k closest neighbours.",
      },
      {
        title: "Logistic regression",
        minutes: 7,
        body: [
          "Logistic regression takes the straight-line formula and squeezes its result between 0 and 1 with an S-shaped curve called the sigmoid. The output reads as a probability: 0.9 means 90% sure it is spam.",
          "Anything above a threshold, usually 0.5, is assigned to the positive group.",
        ],
        takeaway: "Despite its name, logistic regression is a classifier that outputs probabilities.",
      },
      {
        title: "Is it any good?",
        minutes: 7,
        body: [
          "Accuracy is the share of answers the model got right. It can mislead: if 99 of 100 patients are healthy, a model that always says healthy is 99% accurate and useless.",
          "Precision asks: of the cases flagged positive, how many really were? Recall asks: of the real positives, how many did we catch?",
        ],
        takeaway: "With unbalanced groups, look at precision and recall, not only accuracy.",
      },
    ],
  },
  {
    slug: "decision-trees",
    number: "04",
    title: "Decision trees and forests",
    summary: "Models that ask a series of yes or no questions, and why many trees beat one.",
    level: "Intermediate",
    practice: { label: "Find a dataset to try", to: "/datasets" },
    lessons: [
      {
        title: "Twenty questions",
        minutes: 5,
        body: [
          "A decision tree is a flowchart. Is the petal longer than 2.5 cm? If no, it is a setosa. If yes, ask the next question. Each answer leads down a branch until you reach a leaf holding the prediction.",
          "Trees are popular because anyone can read them and see exactly why a prediction was made.",
        ],
        takeaway: "A tree predicts by following yes or no questions down to a leaf.",
      },
      {
        title: "Choosing the questions",
        minutes: 7,
        body: [
          "At every step the tree tries many possible questions and keeps the one that separates the groups most cleanly. Cleanliness is measured with scores such as Gini impurity: 0 means a group holds only one class.",
          "Left alone, a tree keeps splitting until it has memorised every training example. Limiting its depth keeps it honest.",
        ],
        takeaway: "Trees pick the split that makes the resulting groups purest.",
      },
      {
        title: "Random forests",
        minutes: 7,
        body: [
          "One tree is jumpy: change a few examples and it can look completely different. A random forest grows hundreds of trees, each on a random sample of the data and features, and lets them vote.",
          "Individual mistakes cancel out, so the forest is far steadier and more accurate than any single tree.",
        ],
        takeaway: "Many varied trees voting together beat one tree alone.",
      },
    ],
  },
  {
    slug: "clustering",
    number: "05",
    title: "Clustering",
    summary: "Find natural groups in data when nobody has given you the answers.",
    level: "Intermediate",
    practice: { label: "Step through K-means", to: "/visualizer" },
    lessons: [
      {
        title: "Learning without labels",
        minutes: 5,
        body: [
          "Sometimes there are no labels at all: a shop has purchase histories but no list of customer types. Clustering groups similar examples together so patterns become visible.",
          "This is unsupervised learning. There is no right answer to check against, only groupings that are more or less useful.",
        ],
        takeaway: "Clustering discovers groups; nobody tells it what they are.",
      },
      {
        title: "K-means, step by step",
        minutes: 7,
        body: [
          "Pick k, the number of groups you want. Drop k centre points at random. Then repeat two moves: assign every point to its nearest centre, and move each centre to the middle of the points assigned to it.",
          "After a few rounds nothing changes any more. The centres have settled and the clusters are found.",
        ],
        takeaway: "K-means alternates between assigning points and moving centres.",
      },
      {
        title: "How many clusters?",
        minutes: 6,
        body: [
          "K-means needs you to choose k up front. A common trick is to run it for several values and plot how tight the clusters are. The tightness improves quickly at first and then levels off; the bend in that curve, the elbow, is a sensible k.",
          "Results also depend on where the centres start, so it is normal to run it several times and keep the best.",
        ],
        takeaway: "Use the elbow of the curve to choose k, and try several starts.",
      },
    ],
  },
  {
    slug: "neural-networks",
    number: "06",
    title: "Neural networks",
    summary: "Stack simple units into layers and learn shapes no straight line can draw.",
    level: "Intermediate",
    practice: { label: "Train one in the playground", to: "/playground" },
    lessons: [
      {
        title: "The neuron",
        minutes: 6,
        body: [
          "A neuron multiplies each input by a weight, adds them up, and passes the total through an activation function that decides how strongly it fires. One neuron alone is barely more than linear regression.",
          "The power comes from wiring many of them together.",
        ],
        takeaway: "A neuron is a weighted sum followed by an activation function.",
      },
      {
        title: "Layers and depth",
        minutes: 7,
        body: [
          "Neurons are arranged in layers. The first layer sees the raw inputs, each hidden layer builds on the one before, and the last layer gives the answer. Early layers learn simple patterns; later layers combine them into complex ones.",
          "Without activation functions, stacking layers would still only produce a straight line. The bend they add is what lets networks draw curves.",
        ],
        takeaway: "Hidden layers with activations let a network learn curved boundaries.",
      },
      {
        title: "Backpropagation",
        minutes: 8,
        body: [
          "Training a network is gradient descent again. The network makes a prediction, the error is measured, and the blame is passed backwards layer by layer so every weight learns how much it contributed.",
          "Each weight is then nudged a little in the direction that reduces the error. One full pass over the training data is called an epoch.",
        ],
        takeaway: "Backpropagation tells every weight how to change to lower the error.",
      },
      {
        title: "Tuning the knobs",
        minutes: 6,
        body: [
          "The settings you choose before training are called hyperparameters: learning rate, number of layers, neurons per layer, activation. There is no formula for them; you experiment.",
          "A bigger network can learn harder shapes but also memorises noise more easily. Start small and add capacity only when the model clearly cannot cope.",
        ],
        takeaway: "Hyperparameters are chosen by experiment. Start small.",
      },
    ],
  },
];

export const TOTAL_LESSONS = MODULES.reduce((n, m) => n + m.lessons.length, 0);
export const getModule = (slug: string) => MODULES.find((m) => m.slug === slug);
