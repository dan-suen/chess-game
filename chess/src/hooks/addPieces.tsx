import { ReactComponent as BBishopIcon } from "./Chess_bdt45.svg";
import { ReactComponent as WBishopIcon } from "./Chess_blt45.svg";
import { ReactComponent as BKingIcon } from "./Chess_kdt45.svg";
import { ReactComponent as WKingIcon } from "./Chess_klt45.svg";
import { ReactComponent as BKnightIcon } from "./Chess_ndt45.svg";
import { ReactComponent as WKnightIcon } from "./Chess_nlt45.svg";
import { ReactComponent as BQueenIcon } from "./Chess_qdt45.svg";
import { ReactComponent as WQueenIcon } from "./Chess_qlt45.svg";
import { ReactComponent as BRookIcon } from "./Chess_rdt45.svg";
import { ReactComponent as WRookIcon } from "./Chess_rlt45.svg";
import { ReactComponent as BPawnIcon } from "./Chess_pdt45.svg";
import { ReactComponent as WPawnIcon } from "./Chess_plt45.svg";
import { createRoot } from 'react-dom/client';
const EmptyIcon: React.FC = () => (
    <svg width="0" height="0" style={{ display: 'none' }}>
      {}
    </svg>
  );
const map:Record<string, React.ComponentType<React.SVGProps<SVGSVGElement>>> = {
    'BB1' : BBishopIcon, 
    'BB2' : BBishopIcon,
    'WB1' : WBishopIcon,
    'WB2' : WBishopIcon,
    'BK1' : BKnightIcon,
    'BK2' : BKnightIcon,
    'WK1' : WKnightIcon,
    'WK2' : WKnightIcon,
    'BK' :BKingIcon,
    'WK' :WKingIcon,
    'WQ' :WQueenIcon,
    'BQ' :BQueenIcon,
    'BR1' :BRookIcon,
    'BR2' :BRookIcon,
    'WR1' :WRookIcon,
    'WR2' :WRookIcon,
    'WP1':WPawnIcon,
    'WP2':WPawnIcon,
    'WP3':WPawnIcon,
    'WP4':WPawnIcon,
    'WP5':WPawnIcon,
    'WP6':WPawnIcon,
    'WP7':WPawnIcon,
    'WP8':WPawnIcon,
    'BP1':BPawnIcon,
    'BP2':BPawnIcon,
    'BP3':BPawnIcon,
    'BP4':BPawnIcon,
    'BP5':BPawnIcon,
    'BP6':BPawnIcon,
    'BP7':BPawnIcon,
    'BP8':BPawnIcon,
    "X" : EmptyIcon
}
const addPieces = function (flip:boolean, positions:(string|null)[], setPositions:React.Dispatch<React.SetStateAction<(string | null)[]>>) {
    let array = Array(64).fill(null);
    if (!flip) {
        array[0] = "BR1";
        array[1] = "BK1";
        array[2] = "BB1";
        array[3] = "BK";
        array[4] = "BQ";
        array[5] = "BB2";
        array[6] = "BK2";
        array[7] = "BR2";
        array[8] = "BP1";
        array[9] = "BP2";
        array[10] = "BP3";
        array[11] = "BP4";
        array[12] = "BP5";
        array[13] = "BP6";
        array[14] = "BP7";
        array[15] = "BP8";

        

        array[48] = "WR1";
        array[49] = "WK1";
        array[50] = "WB1";
        array[51] = "WK";
        array[52] = "WQ";
        array[53] = "WB2";
        array[54] = "WK2";
        array[55] = "WR2";
        array[56] = "WP1";        
        array[57] = "WP2";
        array[58] = "WP3";
        array[59] = "WP4";
        array[60] = "WP5";
        array[61] = "WP6";
        array[62] = "WP7";
        array[63] = "WP8";
        
    } else {
        array[0] = "WR1";
        array[1] = "WK1";
        array[2] = "WB1";
        array[3] = "WK";
        array[4] = "WQ";
        array[5] = "WB2";
        array[6] = "WK2";
        array[7] = "WR2";
        array[8] = "WP1";
        array[9] = "WP2";
        array[10] = "WP3";
        array[11] = "WP4";
        array[12] = "WP5";
        array[13] = "WP6";
        array[14] = "WP7";
        array[15] = "WP8";

        

        array[48] = "BR1";
        array[49] = "BK1";
        array[50] = "BB1";
        array[51] = "BK";
        array[52] = "BQ";
        array[53] = "BB2";
        array[54] = "BK2";
        array[55] = "BR2";
        array[56] = "BP1";        
        array[57] = "BP2";
        array[58] = "BP3";
        array[59] = "BP4";
        array[60] = "BP5";
        array[61] = "BP6";
        array[62] = "BP7";
        array[63] = "BP8";
    }
    setPositions(array)



    positions.forEach((element,index) => {
        let target = document.getElementById(`cell-${index}`);
        if (target) {
            const root = createRoot(target);
            const IconComponent = map[element || "X"];
            console.log( map[element || "X"], element)
            root.render(
            <>
                {
                IconComponent ? <IconComponent key={`${element}`} className="icon-size" /> : null
                }
            </>

        );
        }
    })
}

export default addPieces;