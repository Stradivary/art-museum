import {
  type Preference,
  PreferenceRepository,
} from '@/infrastructure/repositories/PreferenceRepository'

export class GetPreferenceUseCase {
  async execute(): Promise<Preference | null> {
    return PreferenceRepository.get()
  }
}

export class SetPreferenceUseCase {
  async execute(pref: Preference): Promise<void> {
    await PreferenceRepository.set(pref)
  }
}

export class ClearPreferenceUseCase {
  async execute(): Promise<void> {
    await PreferenceRepository.clear()
  }
}
