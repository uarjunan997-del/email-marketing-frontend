import { useAuth } from '../contexts/AuthContext';

export const usePlanGate = () => {
  const { user } = useAuth();
  const tier = (user?.planTier || 'FREE').toUpperCase();
  const isAtLeast = (required: string) => {
    const order = ['FREE','PRO','PREMIUM'];
    return order.indexOf(tier) >= order.indexOf(required.toUpperCase());
  };
  return { tier, isPro: isAtLeast('PRO'), isPremium: isAtLeast('PREMIUM'), isAtLeast };
};
