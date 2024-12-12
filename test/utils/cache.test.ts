import NodeCache from 'node-cache';
import { deleteCache, getCache, setCache, setCustomCache } from '../../src/utils/cache';

jest.mock('node-cache');

describe('Cache Functions', () => {
    let mockCache: jest.Mocked<NodeCache>;

    beforeEach(() => {
        mockCache = new NodeCache() as jest.Mocked<NodeCache>;
        setCustomCache(mockCache);
    });

    it('should return cached value when it exists', () => {
        mockCache.get.mockReturnValue('cached value');

        const result = getCache('testKey');

        expect(mockCache.get).toHaveBeenCalledWith('testKey');
        expect(result).toBe('cached value');
    });

    it('should return undefined if key is not found in cache', () => {
        mockCache.get.mockReturnValue(undefined);

        const result = getCache('nonExistentKey');

        expect(mockCache.get).toHaveBeenCalledWith('nonExistentKey');
        expect(result).toBeUndefined();
    });

    it('should set value in cache', () => {
        mockCache.set.mockImplementation(() => true);

        setCache('testKey', 'testValue');

        expect(mockCache.set).toHaveBeenCalledWith('testKey', 'testValue');
    });

    it('should delete value from cache', () => {
        mockCache.del.mockImplementation(() => 1);

        deleteCache('testKey');

        expect(mockCache.del).toHaveBeenCalledWith('testKey');
    });
});
