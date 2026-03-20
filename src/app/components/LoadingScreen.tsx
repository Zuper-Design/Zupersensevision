import { SenseLogo } from './SenseLogo';

export function LoadingScreen() {
  return (
    <div className="fixed inset-0 bg-white z-50 flex flex-col items-center justify-center">
      <SenseLogo size={80} animated={true} />
      <p className="text-[15px] text-[#6B7280] mt-6">Loading...</p>
    </div>
  );
}
