import { createContext, useContext } from 'react';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { getData, mutations } from '../services/api';

const C = createContext();

export function AuthProvider({ children }) {
  const q = useQuery({
    queryKey: ['me'],
    queryFn: () => getData('/auth/me'),
    retry: false,
    staleTime: 3e5
  });

  const client = useQueryClient();

  const login = d =>
    mutations.post('/auth/login', d).then(x => {
      client.setQueryData(['me'], x);
      return x;
    });

  const logout = () =>
    mutations
      .post('/auth/logout')
      .finally(() => client.setQueryData(['me'], null));

  return (
    <C.Provider
      value={{
        user: q.data?.data?.user,
        loading: q.isLoading,
        login,
        logout
      }}
    >
      {children}
    </C.Provider>
  );
}

export const useAuth = () => useContext(C);