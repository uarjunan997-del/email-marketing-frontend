import { describe, it, expect, beforeEach } from 'vitest';
import { renderHook, act } from '@testing-library/react';
import { useTemplateManager } from '@hooks/useTemplateManager';

// simple localStorage mock isolation
beforeEach(()=>{
  localStorage.clear();
});

describe('useTemplateManager', () => {
  it('creates and updates template with versions & meta persistence', async () => {
    const { result } = renderHook(()=> useTemplateManager());
  // initial refresh runs async; wait a tick
  await act(async ()=> { /* flush */ });
    let saved: any;
    await act(async ()=> { saved = await result.current.save({ name: 'Welcome', subject: 'Hi', design: { body: {} } }); });
    expect(saved.id).toBeTruthy();
    expect(result.current.templates.length).toBe(1);
    // update meta directly
    await act(async ()=> { await result.current.updateMeta({ id: saved.id, name: 'Welcome Updated', tags: ['onboarding','welcome'] }); });
    const updated = result.current.templates[0];
    expect(updated.name).toBe('Welcome Updated');
    expect(updated.tags).toContain('onboarding');
    // save new version
    await act(async ()=> { await result.current.save({ id: saved.id, name: updated.name, subject: updated.subject, design: { body: { rows: 1 } }, tags: updated.tags }); });
    // load full record
    await act(async ()=> { await result.current.load(saved.id); });
  expect((result.current.current?.versions?.length || 0)).toBeGreaterThan(0);
  });

  it('filters by search & tags', async () => {
    const { result } = renderHook(()=> useTemplateManager());
    await act(async ()=> { await result.current.save({ name: 'Promo', subject: 'Sale', design: {} , tags:['promo']}); });
    await act(async ()=> { await result.current.save({ name: 'Newsletter', subject: 'Month', design: {} , tags:['news']}); });
    expect(result.current.templates.length).toBe(2);
    act(()=> { result.current.setFilter('promo'); });
    expect(result.current.templates.length).toBe(1);
    act(()=> { result.current.setFilter(''); result.current.setTagFilter(['news']); });
    expect(result.current.templates.length).toBe(1);
    expect(result.current.templates[0].name).toBe('Newsletter');
  });
});
