import { describe, expect, it } from 'vitest';
import { getServiceLinkedObjectIds, isServiceLinkedToObject } from './serviceObjectLinks.js';

describe('serviceObjectLinks', () => {
    it('prefers linked_object_ids when present', () => {
        const service = {
            object_id: 'obj-legacy',
            linked_object_ids: ['obj-2', 'obj-1', 'obj-2']
        };

        expect(getServiceLinkedObjectIds(service)).toEqual(['obj-2', 'obj-1']);
    });

    it('falls back to service_objects rows when linked_object_ids are absent', () => {
        const service = {
            service_objects: [
                { object_id: 'obj-1' },
                { object_id: 'obj-3' },
                { object_id: 'obj-1' }
            ]
        };

        expect(getServiceLinkedObjectIds(service)).toEqual(['obj-1', 'obj-3']);
    });

    it('falls back to legacy object_id when no link arrays exist', () => {
        expect(getServiceLinkedObjectIds({ object_id: 'obj-legacy' })).toEqual(['obj-legacy']);
    });

    it('checks whether a service is linked to a given object', () => {
        const service = { linked_object_ids: ['obj-1', 'obj-2'] };

        expect(isServiceLinkedToObject(service, 'obj-2')).toBe(true);
        expect(isServiceLinkedToObject(service, 'obj-9')).toBe(false);
    });
});
