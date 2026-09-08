import { architectMarathon } from '../services/ai/marathonArchitect.js';
import { asyncHandler } from '../utils/asyncHandler.js';

/**
 * Controller to handle AI Marathon / Double Feature generation
 */
export const generateMarathon = asyncHandler(async (req, res) => {
  const { anchorQuery = '', theme = '', mode = 'double' } = req.body || {};

  const validMode = (mode === 'triple' || mode === 'double') ? mode : 'double';

  const marathonResult = await architectMarathon({
    anchorQuery: String(anchorQuery || ''),
    theme: String(theme || ''),
    mode: validMode
  });

  return res.status(200).json(marathonResult);
});
