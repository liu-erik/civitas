export type Language = {
  code: string;
  name: string;
};

export type Category = {
  id: string;
  slug: string;
  icon: string;
  color: 'blue' | 'green';
  name: string;
  description: string;
  topic_count?: number;
};

export type Topic = {
  id: string;
  category_id: string;
  slug: string;
  title: string;
  what_it_is?: string;
  why_it_matters?: string;
  what_you_can_do?: string;
};

export type ChatMessage = {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  sources?: Source[];
};

export type Source = {
  title: string;
  url: string;
  summary: string;
};

export type LocalData = {
  id: string;
  type: 'representative' | 'organization' | 'event';
  city: string;
  state?: string;
  /** Flexible JSON from `local_data`; CLAUDE.md specifies `Record<string, any>`. */
  // eslint-disable-next-line @typescript-eslint/no-explicit-any -- schema from CLAUDE.md
  data: Record<string, any>;
};
