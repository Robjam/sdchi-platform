
Tests are of the utmost importance; not only do they validate correctness, they can create the necessary safetynets required for changing code.
Here are some bad and good examples:
<bad>
import { describe, it, vi } from 'vitest'; 

describe('server/routes/index.ts', () => {
  it('should validate the parameters with the session db', async () => {
    /* ❌ BAD: we have no idea what setupDb() does, and we have to then go look and see.
    * if setupDb has more than 20 lines of code, the relevancy of that code is suspicious
    * and creates debuggabilty nightmares as the code base grows
    */
    await setupDb();
    const params = { id: 1 }
    const result = sessionDb(params)
    expect(result).toBe(true)
  })
})
</bad>
<bad>
import { describe, it, vi } from 'vitest'; 
import { testData } from '../testUtils/sessions'

describe('server/routes/index.ts', () => {
  it('should validate the parameters with the session db', async () => {
    /* ❌ BAD: we have no idea what correct values are, and we have to then go look and see.
    * This is an example of an unnecessary "abstraction" that actually is a "misdirection".
    */
    const db = {
      get: vi.fn().mockReturnValue(testData.correctValues),
      set: vi.fn(),
      delete: vi.fn(),
    }
    const params = { id: 1 }
    const result = sessionDb(params)
    expect(result).toBe(true)
  })
})
</bad>

<good>
import { describe, it, vi } from 'vitest'; 
import { createSesssionData } from '../testUtils/sessions'

describe('server/routes/index.ts', () => {
  it('should validate the parameters with the session db', async () => {
    /* ✅ GOOD: the createSessionData function is a factory function creates a valid session data object.
    * with a simple mechanism to overwrite only the pertinent values.
    */
    const sessionData = [createSesssionData({
      expiresAt: new Date(Date.now() + 1000 * 60 * 60 * 24),
      userId: 1,
    })]
    const db = {
      get: vi.fn().mockReturnValue(sessionData),
      set: vi.fn(),
      delete: vi.fn(),
    }
    const params = { id: 1 }
    const result = sessionDb(params)
    expect(result).toBe(true)
  })
})
</good>
