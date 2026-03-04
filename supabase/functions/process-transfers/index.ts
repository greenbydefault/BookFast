import { serve } from 'https://deno.land/std@0.177.0/http/server.ts';
import { corsHeaders } from '../_shared/cors.ts';

// DEPRECATED: This function is no longer needed with Direct Charges
// With Direct Charges, payments go directly to the connected account
// No scheduled transfers are required
//
// This file is kept for backwards compatibility but does nothing

serve(async (req: Request) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders });
  }

  console.log('process-transfers called but is deprecated (Direct Charges mode)');

  return new Response(
    JSON.stringify({
      success: true,
      processed: 0,
      message: 'DEPRECATED: Transfer processing is no longer needed with Direct Charges. Payments go directly to connected accounts.',
    }),
    { status: 200, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
  );
});
