import { renderHook, act } from '@testing-library/react'
import { useRegisterTeachingTip, UseTeachingTipOptions } from '@/presentation/hooks/useRegisterTeachingTip'
import * as useTeachingTipModule from '@/presentation/hooks/useTeachingTip'

describe('useRegisterTeachingTip', () => {
  const registerTip = vi.fn()
  const unregisterTip = vi.fn()
  const showTip = vi.fn()
  const isTipRegistered = vi.fn().mockReturnValue(false)

  const baseOptions: UseTeachingTipOptions = {
    id: 'tip-1',
    title: 'Title',
    description: 'Description',
  }

  beforeEach(() => {
    vi.clearAllMocks()
    vi.spyOn(useTeachingTipModule, 'useTeachingTip').mockReturnValue({
      registerTip,
      unregisterTip,
      showTip,
      isTipRegistered,
    })
  })

  it('should not register tip if ref is null', () => {
    renderHook(() => useRegisterTeachingTip(baseOptions))
    expect(registerTip).not.toHaveBeenCalled()
  })
 

  it('should not register tip if enabled is false', () => {
    renderHook(() => useRegisterTeachingTip({ ...baseOptions, enabled: false }))
    expect(registerTip).not.toHaveBeenCalled()
  })

  it('show should call showTip if enabled and tip is registered', () => {
    isTipRegistered.mockReturnValue(true)
    const { result } = renderHook(() => useRegisterTeachingTip(baseOptions))
    act(() => {
      (result.current.ref as React.MutableRefObject<HTMLElement | null>).current = document.createElement('div')
    })
    act(() => {
      result.current.show()
    })
    expect(showTip).toHaveBeenCalledWith(baseOptions.id)
  })

  it('show should not call showTip if not enabled', () => {
    isTipRegistered.mockReturnValue(true)
    const { result } = renderHook(() => useRegisterTeachingTip({ ...baseOptions, enabled: false }))
    act(() => {
      result.current.show()
    })
    expect(showTip).not.toHaveBeenCalled()
  })

  it('show should not call showTip if tip is not registered', () => {
    isTipRegistered.mockReturnValue(false)
    const { result } = renderHook(() => useRegisterTeachingTip(baseOptions))
    act(() => {
      result.current.show()
    })
    expect(showTip).not.toHaveBeenCalled()
  })

  it('isRegistered should reflect isTipRegistered', () => {
    isTipRegistered.mockReturnValue(true)
    const { result } = renderHook(() => useRegisterTeachingTip(baseOptions))
    expect(result.current.isRegistered).toBe(true)
    isTipRegistered.mockReturnValue(false)
    const { result: result2 } = renderHook(() => useRegisterTeachingTip(baseOptions))
    expect(result2.current.isRegistered).toBe(false)
  })
})