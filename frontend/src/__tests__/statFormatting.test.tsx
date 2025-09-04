import { describe, it, expect } from 'vitest';
import React from 'react';
import { render, screen } from '@testing-library/react';
import DashboardStats, { StatItem } from '../components/DashboardStats';

// Simple formatting check: ensures values render and delta sign present for positive deltas

describe('DashboardStats formatting', () => {
  const stats: StatItem[] = [
    {id:'sent', label:'Campaigns Sent', value:128, delta:12},
    {id:'open', label:'Avg Open Rate', value:'41%', delta:3},
    {id:'click', label:'Avg Click Rate', value:'9%', delta:-1}
  ];

  it('renders stat labels and values', () => {
    render(<DashboardStats stats={stats} />);
    for(const s of stats){
      expect(screen.getByText(s.label)).toBeInTheDocument();
      expect(screen.getByText(String(s.value))).toBeInTheDocument();
    }
  });

  it('shows plus sign for positive deltas', () => {
    render(<DashboardStats stats={stats} />);
    expect(screen.getByText('+12% vs last period')).toBeInTheDocument();
    expect(screen.getByText('+3% vs last period')).toBeInTheDocument();
    expect(screen.getByText('-1% vs last period')).toBeInTheDocument();
  });
});
