export type Task = "Classification" | "Regression" | "Images" | "Text";
export type Dataset = {
  id: string;
  name: string;
  task: Task;
  rows: string;
  features: string;
  target: string;
  difficulty: "Starter" | "Intermediate";
  about: string;
  columns: string[];
  source: string;
};

export const TASKS: Task[] = ["Classification", "Regression", "Images", "Text"];

export const DATASETS: Dataset[] = [
  {
    id: "iris",
    name: "Iris",
    task: "Classification",
    rows: "150",
    features: "4",
    target: "3 flower species",
    difficulty: "Starter",
    about:
      "Measurements of iris flowers from three species. Tiny, clean and the classic first dataset for classification.",
    columns: ["sepal length", "sepal width", "petal length", "petal width", "species"],
    source: "https://archive.ics.uci.edu/dataset/53/iris",
  },
  {
    id: "titanic",
    name: "Titanic",
    task: "Classification",
    rows: "891",
    features: "11",
    target: "Survived or not",
    difficulty: "Starter",
    about:
      "Passenger records from the Titanic. Good practice for handling missing values and mixed column types.",
    columns: ["class", "sex", "age", "siblings/spouses", "parents/children", "fare", "embarked", "survived"],
    source: "https://www.kaggle.com/c/titanic",
  },
  {
    id: "breast-cancer",
    name: "Breast Cancer Wisconsin",
    task: "Classification",
    rows: "569",
    features: "30",
    target: "Malignant or benign",
    difficulty: "Starter",
    about:
      "Measurements of cell nuclei from breast tissue samples. A clean two-class problem where recall really matters.",
    columns: ["mean radius", "mean texture", "mean perimeter", "mean area", "mean smoothness", "diagnosis"],
    source: "https://archive.ics.uci.edu/dataset/17/breast+cancer+wisconsin+diagnostic",
  },
  {
    id: "wine",
    name: "Wine",
    task: "Classification",
    rows: "178",
    features: "13",
    target: "3 grape cultivars",
    difficulty: "Starter",
    about:
      "Chemical analysis of wines grown in one region of Italy from three different cultivars.",
    columns: ["alcohol", "malic acid", "ash", "magnesium", "flavanoids", "colour intensity", "cultivar"],
    source: "https://archive.ics.uci.edu/dataset/109/wine",
  },
  {
    id: "california-housing",
    name: "California Housing",
    task: "Regression",
    rows: "20,640",
    features: "8",
    target: "Median house value",
    difficulty: "Starter",
    about:
      "Census data for California districts. The standard dataset for a first regression project.",
    columns: ["median income", "house age", "average rooms", "average bedrooms", "population", "latitude", "longitude", "median value"],
    source: "https://scikit-learn.org/stable/datasets/real_world.html#california-housing-dataset",
  },
  {
    id: "diabetes",
    name: "Diabetes",
    task: "Regression",
    rows: "442",
    features: "10",
    target: "Disease progression after one year",
    difficulty: "Starter",
    about:
      "Baseline measurements for diabetes patients with a numeric measure of how the disease progressed.",
    columns: ["age", "sex", "body mass index", "blood pressure", "six blood serum measures", "progression"],
    source: "https://scikit-learn.org/stable/datasets/toy_dataset.html#diabetes-dataset",
  },
  {
    id: "mnist",
    name: "MNIST",
    task: "Images",
    rows: "70,000",
    features: "28 × 28 pixels",
    target: "Digits 0 to 9",
    difficulty: "Intermediate",
    about:
      "Greyscale images of handwritten digits. The starting point for almost everyone learning neural networks.",
    columns: ["784 pixel values", "digit"],
    source: "https://en.wikipedia.org/wiki/MNIST_database",
  },
  {
    id: "fashion-mnist",
    name: "Fashion-MNIST",
    task: "Images",
    rows: "70,000",
    features: "28 × 28 pixels",
    target: "10 clothing types",
    difficulty: "Intermediate",
    about:
      "Same size and shape as MNIST but with pictures of clothing, which makes it noticeably harder.",
    columns: ["784 pixel values", "clothing type"],
    source: "https://github.com/zalandoresearch/fashion-mnist",
  },
  {
    id: "cifar-10",
    name: "CIFAR-10",
    task: "Images",
    rows: "60,000",
    features: "32 × 32 colour pixels",
    target: "10 object classes",
    difficulty: "Intermediate",
    about:
      "Small colour photos of planes, cars, birds, cats and more. A step up to real-world image recognition.",
    columns: ["3,072 colour values", "object class"],
    source: "https://www.cs.toronto.edu/~kriz/cifar.html",
  },
  {
    id: "imdb",
    name: "IMDB Reviews",
    task: "Text",
    rows: "50,000",
    features: "Review text",
    target: "Positive or negative",
    difficulty: "Intermediate",
    about:
      "Film reviews labelled by sentiment, split evenly between positive and negative. A first text project.",
    columns: ["review", "sentiment"],
    source: "https://ai.stanford.edu/~amaas/data/sentiment/",
  },
  {
    id: "sms-spam",
    name: "SMS Spam Collection",
    task: "Text",
    rows: "5,574",
    features: "Message text",
    target: "Spam or ham",
    difficulty: "Starter",
    about:
      "Real text messages tagged as spam or legitimate. Short texts and unbalanced classes make it instructive.",
    columns: ["message", "label"],
    source: "https://archive.ics.uci.edu/dataset/228/sms+spam+collection",
  },
];
