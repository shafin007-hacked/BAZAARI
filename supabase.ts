
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://doklcincnvwtlqjwmoal.supabase.co';
const supabaseKey = 'sb_publishable_cformAXpy7vKLwh0CtRCCQ_eAectrCh';

export const supabase = createClient(supabaseUrl, supabaseKey);

export default supabase;
