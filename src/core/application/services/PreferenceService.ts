import {
  type Preference,
  PreferenceRepository,
} from '@/infrastructure/repositories/PreferenceRepository'

export class PreferenceService {
  async getPreference(): Promise<Preference | null> {
    return PreferenceRepository.get()
  }

  async setPreference(pref: Preference): Promise<void> {
    await PreferenceRepository.set(pref)
  }

  async clearPreference(): Promise<void> {
    await PreferenceRepository.clear()
  }
}
