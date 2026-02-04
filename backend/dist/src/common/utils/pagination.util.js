"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.paginate = paginate;
exports.getPaginationMeta = getPaginationMeta;
exports.buildPaginationQuery = buildPaginationQuery;
exports.buildOrderByQuery = buildOrderByQuery;
exports.buildSearchQuery = buildSearchQuery;
function paginate(data, total, page, limit) {
    return {
        data,
        meta: {
            page,
            limit,
            total,
            totalPages: Math.ceil(total / limit),
        },
    };
}
function getPaginationMeta(total, page, limit) {
    return {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
    };
}
function buildPaginationQuery(page = 1, limit = 10) {
    const skip = (page - 1) * limit;
    return { skip, take: limit };
}
function buildOrderByQuery(sortBy, sortOrder = 'desc', defaultSort = 'createdAt') {
    const field = sortBy || defaultSort;
    return { [field]: sortOrder };
}
function buildSearchQuery(search, fields = ['name']) {
    if (!search)
        return {};
    return {
        OR: fields.map((field) => ({
            [field]: {
                contains: search,
                mode: 'insensitive',
            },
        })),
    };
}
//# sourceMappingURL=pagination.util.js.map