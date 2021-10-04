import { User } from './user/model/User';
import { Request, Response } from 'express';
import asyncHooks from 'async_hooks';

type ContextKey = 'language' | 'user';
type ContextItem = { language: string; user: User };

export const store = new Map<number, ContextItem>();

asyncHooks
  .createHook({
    init: (asyncId, _, triggerAsyncId) => {
      if (store.has(triggerAsyncId)) {
        store.set(asyncId, store.get(triggerAsyncId));
      }
    },
    destroy: (asyncId) => {
      if (store.has(asyncId)) {
        store.delete(asyncId);
      }
    },
  })
  .enable();

export const requestContextMiddleware = (req: Request, res: Response, next: () => void): void => {
  const user = req.headers['x-user'] ? JSON.parse(req.headers['x-user'] as string) : undefined;

  store.set(asyncHooks.executionAsyncId(), { user, language: req.language });
  next();
};

export const getContext = (): { language: string; user: User } => {
  return store.get(asyncHooks.executionAsyncId());
};

export const getContextItem = <T extends ContextKey>(key: T): ContextItem[T] => {
  const context = store.get(asyncHooks.executionAsyncId());
  return context ? context[key] : undefined;
};
