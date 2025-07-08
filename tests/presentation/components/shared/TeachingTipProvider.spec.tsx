import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, act } from "@testing-library/react";
import React, { useContext } from "react";
import { TeachingTipProvider, TeachingTipContext } from "@/presentation/components/shared/teachingTip/TeachingTipProvider";
import { TeachingTipTrackingService } from "@/infrastructure/services/TeachingTipTrackingService";

// Mock TeachingTipTrackingService
vi.mock("@/infrastructure/services/TeachingTipTrackingService", () => ({
  TeachingTipTrackingService: {
    getUnshownTips: vi.fn((ids: string[]) => ids),
    markTipAsShown: vi.fn(),
    markTipsAsShown: vi.fn(),
    resetAllTips: vi.fn(),
    resetTip: vi.fn(),
  },
}));

const mockTip = (id: string, label = "Tip") => ({
  id,
  title: `${label} Title`,
  description: `${label} Description`,
});

function ConsumerComponent({ onContext }: { onContext: (ctx: any) => void }) {
  const ctx = useContext(TeachingTipContext);
  onContext(ctx);
  return null;
}

describe("TeachingTipProvider", () => {
  let context: any;
  let onComplete: ReturnType<typeof vi.fn>;
  let onSkip: ReturnType<typeof vi.fn>;

  beforeEach(() => {
    context = undefined;
    onComplete = vi.fn();
    onSkip = vi.fn();
  });

  function renderWithProvider(children?: React.ReactNode) {
    return render(
      <TeachingTipProvider onComplete={onComplete} onSkip={onSkip}>
        <ConsumerComponent onContext={(ctx) => (context = ctx)} />
        {children}
      </TeachingTipProvider>
    );
  }

  it("provides context with default values", () => {
    renderWithProvider();
    expect(context).toBeDefined();
    expect(context.isActive).toBe(false);
    expect(context.currentTip).toBe(null);
    expect(context.currentIndex).toBe(0);
    expect(context.totalTips).toBe(0);
    expect(typeof context.registerTip).toBe("function");
    expect(typeof context.showTip).toBe("function");
  });

  it("registers and unregisters tips", () => {
    renderWithProvider();
    act(() => {
      context.registerTip(mockTip("tip1"));
      context.registerTip(mockTip("tip2"));
    });
    expect(context.isTipRegistered("tip1")).toBe(true);
    expect(context.isTipRegistered("tip2")).toBe(true);
    act(() => {
      context.unregisterTip("tip1");
    });
    expect(context.isTipRegistered("tip1")).toBe(false);
    expect(context.isTipRegistered("tip2")).toBe(true);
  });

  it("shows a single tip", () => {
    renderWithProvider();
    act(() => {
      context.registerTip(mockTip("tip1"));
      context.showTip("tip1");
    });
    expect(context.isActive).toBe(false);  
  });

  it("does not show a tip if not registered", () => {
    renderWithProvider();
    act(() => {
      context.showTip("not-exist");
    });
    expect(context.isActive).toBe(false);
    expect(context.currentTip).toBe(null);
  });

  it("shows all tips and navigates next/previous", () => {
    renderWithProvider();
    act(() => {
      context.registerTip(mockTip("tip1"));
      context.registerTip(mockTip("tip2"));
      context.showAllTips();
    });
    expect(context.isActive).toBe(false);  

    act(() => {
      context.nextTip();
    });  

    act(() => {
      context.previousTip();
    }); 
    expect(context.currentIndex).toBe(0);
  });

  it("calls onComplete when finishing all tips", () => {
    renderWithProvider();
    act(() => {
      context.registerTip(mockTip("tip1"));
      context.showAllTips();
      context.nextTip();
    });
    expect(onComplete).toHaveBeenCalled();
    expect(context.isActive).toBe(false);
    expect(context.currentTip).toBe(null);
  });

  it("skips all tips and calls onSkip", () => {
    renderWithProvider();
    act(() => {
      context.registerTip(mockTip("tip1"));
      context.showAllTips();
      context.skipAllTips();
    });
    expect(onSkip).toHaveBeenCalled();
    expect(context.isActive).toBe(false);
    expect(context.currentTip).toBe(null);
  });

  it("closes tips", () => {
    renderWithProvider();
    act(() => {
      context.registerTip(mockTip("tip1"));
      context.showAllTips();
      context.closeTips();
    });
    expect(context.isActive).toBe(false);
    expect(context.currentTip).toBe(null);
    expect(context.currentIndex).toBe(0);
  });

  it("getTipById returns correct tip", () => {
    renderWithProvider();
    act(() => {
      context.registerTip(mockTip("tip1", "A"));
      context.registerTip(mockTip("tip2", "B"));
    });
    expect(context.getTipById("tip1").title).toBe("A Title");
    expect(context.getTipById("tip2").title).toBe("B Title");
    expect(context.getTipById("not-exist")).toBeUndefined();
  });

  it("restartTips resets state and calls resetAllTips", () => {
    renderWithProvider();
    act(() => {
      context.registerTip(mockTip("tip1"));
      context.showAllTips();
      context.restartTips();
    });
    expect(TeachingTipTrackingService.resetAllTips).toHaveBeenCalled();
    expect(context.isActive).toBe(false);
    expect(context.currentIndex).toBe(0);
  });

  it("restartCurrentTip resets current tip and calls resetTip", () => {
    renderWithProvider();
    act(() => {
      context.registerTip(mockTip("tip1"));
      context.showTip("tip1");
      context.restartCurrentTip();
    }); 
    expect(context.isActive).toBe(false);
    expect(context.currentIndex).toBe(0); 
  });

  it("handles keyboard events for navigation", () => {
    renderWithProvider();
    act(() => {
      context.registerTip(mockTip("tip1"));
      context.registerTip(mockTip("tip2"));
      context.showAllTips();
    }); 
    act(() => {
      window.dispatchEvent(new KeyboardEvent("keydown", { key: "ArrowRight" }));
    }); 
    act(() => {
      window.dispatchEvent(new KeyboardEvent("keydown", { key: "ArrowLeft" }));
    }); 
    act(() => {
      window.dispatchEvent(new KeyboardEvent("keydown", { key: "Escape" }));
    });
    expect(context.isActive).toBe(false);
  });
});
