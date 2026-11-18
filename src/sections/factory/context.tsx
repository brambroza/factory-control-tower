import { useMemo, useState, useContext, createContext } from 'react';

// ----------------------------------------------------------------------

type FactoryDemoState = {
  /** อนุมัติย้าย WO-48291 ไป M-12 แล้วหรือยัง — หน้า dispatch / work-order / live อ่านค่านี้ร่วมกัน */
  rerouted: boolean;
  setRerouted: (value: boolean) => void;
};

const FactoryDemoContext = createContext<FactoryDemoState | undefined>(undefined);

/** state ของ demo flow ข้ามหน้า — งานจริงให้แทนด้วย store/API ของ project */
export function FactoryDemoProvider({ children }: { children: React.ReactNode }) {
  const [rerouted, setRerouted] = useState(false);

  const value = useMemo(() => ({ rerouted, setRerouted }), [rerouted]);

  return <FactoryDemoContext.Provider value={value}>{children}</FactoryDemoContext.Provider>;
}

export function useFactoryDemo() {
  const context = useContext(FactoryDemoContext);

  if (!context) throw new Error('useFactoryDemo must be used inside FactoryDemoProvider');

  return context;
}
