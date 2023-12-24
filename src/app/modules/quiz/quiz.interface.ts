export type ICreateQuiz = {
  creatorId: string;
  categoryId: string;
  multiChoice: boolean;
  mark: number;
  timeTaken: number;
  question: string;
  quizAnswers: {
    answer: string;
    explanation: string;
    istrue: boolean;
  }[];
};

export type IQuizFilters = {
  searchTerm?: string | undefined;
  question?: string | undefined;
  creatorId?: string | undefined;
  categoryId?: string | undefined;
};
