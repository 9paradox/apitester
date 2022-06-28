import { apitester } from '../src/index';

describe('apitester', () => {
  it('says coming soon', () => {
    expect(apitester()).toEqual('coming soon');
  });
});
