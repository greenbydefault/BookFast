export const getServiceLinkedObjectIds = (service) => {
    if (!service) return [];

    if (Array.isArray(service.linked_object_ids) && service.linked_object_ids.length > 0) {
        return [...new Set(service.linked_object_ids.filter(Boolean))];
    }

    if (Array.isArray(service.service_objects) && service.service_objects.length > 0) {
        return [...new Set(service.service_objects.map((link) => link?.object_id).filter(Boolean))];
    }

    if (service.object_id) {
        return [service.object_id];
    }

    return [];
};

export const isServiceLinkedToObject = (service, objectId) => {
    if (!objectId) return false;
    return getServiceLinkedObjectIds(service).includes(objectId);
};
