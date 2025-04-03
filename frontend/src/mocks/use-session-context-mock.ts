export const useAuthMock: jest.Mock = jest.fn().mockReturnValue({
  session: null,
  setSession: jest.fn(),
});
