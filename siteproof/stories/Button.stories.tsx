import type {Meta,StoryObj} from '@storybook/react';
function DemoButton({label='Submit report'}:{label?:string}){return <button>{label}</button>}
const meta={title:'SiteProof/Button',component:DemoButton,tags:['autodocs']} satisfies Meta<typeof DemoButton>;
export default meta;type Story=StoryObj<typeof meta>;export const Primary:Story={args:{label:'Submit report'}};export const Secondary:Story={args:{label:'Switch user'}};
