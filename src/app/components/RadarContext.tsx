import { createContext, useContext, useState, ReactNode } from 'react';

export interface SavedCard {
  id: string;
  type: 'message' | 'card' | 'chart' | 'widget';
  content: any;
  timestamp: Date;
  title: string;
  preview?: string;
  sourceThreadId?: number;
}

export interface Radar {
  id: string;
  name: string;
  emoji: string;
  cardCount: number;
  cards: SavedCard[];
}

interface RadarContextType {
  radars: Radar[];
  activeRadarId: string | null;
  addRadar: (radar: Omit<Radar, 'id' | 'cardCount' | 'cards'>) => string;
  addRadarWithCards: (radar: Omit<Radar, 'id' | 'cardCount' | 'cards'>, cards: Omit<SavedCard, 'id' | 'timestamp'>[]) => string;
  addCardToRadar: (radarId: string, card: Omit<SavedCard, 'id' | 'timestamp'>) => void;
  removeCardFromRadar: (radarId: string, cardId: string) => void;
  setActiveRadar: (radarId: string | null) => void;
  getRadarById: (radarId: string) => Radar | undefined;
}

const RadarContext = createContext<RadarContextType | undefined>(undefined);

export function RadarProvider({ children }: { children: ReactNode }) {
  const [radars, setRadars] = useState<Radar[]>([
    {
      id: '1',
      name: 'My Workspace',
      emoji: '⚡',
      cardCount: 0,
      cards: [],
    },
  ]);
  const [activeRadarId, setActiveRadarId] = useState<string | null>(null);

  const addRadar = (radar: Omit<Radar, 'id' | 'cardCount' | 'cards'>): string => {
    const id = Date.now().toString();
    const newRadar: Radar = {
      ...radar,
      id,
      cardCount: 0,
      cards: [],
    };
    setRadars((prev) => [...prev, newRadar]);
    return id;
  };

  const addRadarWithCards = (radar: Omit<Radar, 'id' | 'cardCount' | 'cards'>, cards: Omit<SavedCard, 'id' | 'timestamp'>[]): string => {
    const id = Date.now().toString();
    const seedCards: SavedCard[] = cards.map((card, index) => ({
      ...card,
      id: `${id}-seed-${index}`,
      timestamp: new Date(),
    }));
    const newRadar: Radar = {
      ...radar,
      id,
      cardCount: seedCards.length,
      cards: seedCards,
    };
    setRadars((prev) => [...prev, newRadar]);
    return id;
  };

  const addCardToRadar = (radarId: string, card: Omit<SavedCard, 'id' | 'timestamp'>) => {
    const newCard: SavedCard = {
      ...card,
      id: Date.now().toString(),
      timestamp: new Date(),
    };

    setRadars((prev) =>
      prev.map((radar) =>
        radar.id === radarId
          ? {
              ...radar,
              cards: [newCard, ...radar.cards],
              cardCount: radar.cards.length + 1,
            }
          : radar
      )
    );
  };

  const removeCardFromRadar = (radarId: string, cardId: string) => {
    setRadars((prev) =>
      prev.map((radar) =>
        radar.id === radarId
          ? {
              ...radar,
              cards: radar.cards.filter((card) => card.id !== cardId),
              cardCount: radar.cards.filter((card) => card.id !== cardId).length,
            }
          : radar
      )
    );
  };

  const getRadarById = (radarId: string) => {
    return radars.find((radar) => radar.id === radarId);
  };

  return (
    <RadarContext.Provider
      value={{
        radars,
        activeRadarId,
        addRadar,
        addRadarWithCards,
        addCardToRadar,
        removeCardFromRadar,
        setActiveRadar: setActiveRadarId,
        getRadarById,
      }}
    >
      {children}
    </RadarContext.Provider>
  );
}

export function useRadar() {
  const context = useContext(RadarContext);
  if (context === undefined) {
    throw new Error('useRadar must be used within a RadarProvider');
  }
  return context;
}