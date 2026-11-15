import type {Meta,StoryObj} from '@storybook/react';
import type {Status} from '../src/App';
function StatusBadge({status}:{status:Status}){return <span className={'status '+status.replaceAll(' ','-').toLowerCase()}>{status}</span>}
const meta={title:'SiteProof/StatusBadge',component:StatusBadge,tags:['autodocs']} satisfies Meta<typeof StatusBadge>;
export default meta;type Story=StoryObj<typeof meta>;
export const New:Story={args:{status:'New'}};export const Assigned:Story={args:{status:'Assigned'}};export const InProgress:Story={args:{status:'In progress'}};export const ReadyForReview:Story={args:{status:'Ready for review'}};export const Closed:Story={args:{status:'Closed'}};
