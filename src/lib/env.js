// In tests we skip timers/animations so behaviour is deterministic.
export const IS_TEST = import.meta.env?.MODE === 'test';
