export interface LanguageConfig {
  id: number;
  name: string;
  defaultCode: string;
}

export const LANGUAGE_MAP: Record<string, LanguageConfig> = {
  c: {
    id: 52,
    name: 'C',
    defaultCode: '#include<stdio.h>\nint main()\n{\n    printf("Hello world");\n    return 0;\n}',
  },
  cpp: {
    id: 54,
    name: 'C++',
    defaultCode: '#include <iostream>\nusing namespace std;\n\nint main() {\n\tcout << "Hello World!";\n\treturn 0;\n}',
  },
  java: {
    id: 91,
    name: 'Java',
    defaultCode: 'public class Main {\n    public static void main(String[] args) {\n        System.out.println("Hello World!");\n    }\n}',
  },
  python: {
    id: 71,
    name: 'Python',
    defaultCode: 'print("Hello World!")',
  },
  javascript: {
    id: 102,
    name: 'JavaScript',
    defaultCode: 'console.log("Hello World!");',
  },
};

export const SUPPORTED_LANGUAGES = Object.keys(LANGUAGE_MAP);
