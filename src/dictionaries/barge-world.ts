import {Dictionary} from '../Dictionary'
import { PredicateSyntax } from '../PredicateSyntax'

export const barge_world_dict = new Dictionary()
  .addNouns(
    'barge', 
    'dutch barge', 
    'cabin cruiser',
    'narrowboat',
    'kayak',
    'dhingy',
    'tow path',
    'nauticus 27',
    'solid fuel stove',
    'bank',
  )
  .addAdjectives(
    'narrowbeam', 
    'widebeam', 
    'grp', 
    'steel', 
    'wooden', 
    'peanut butter'
  )
  .addStatementSyntaxs(
    new PredicateSyntax('float', ['subject']),
    new PredicateSyntax('sink', ['subject']),
    new PredicateSyntax('be moored', ['subject', 'against'])
  )