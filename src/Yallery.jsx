import { useRef, useState, useEffect } from "react";
import useResizeObserver from "./useResizeObserver";

import ColumnGallery from "./ColumnGallery"
import RowGallery from "./RowGallery"
//import GridGallery from "./GridGallery"


const options_default = {
    adjustments: {
        
    },
    layout: [
        {breakpoint: 600,  columns: [1, 1], gap: {x:10, y:10}},
        {breakpoint: 900,  columns: [1, 1, 1]},
        {breakpoint: 1200, columns: [1, 1, 1, 1], gap: {x:10, y:10}},
        {breakpoint: 1800, columns: 5, gap: 15},
        {breakpoint: 2200, rows: 400}
    ],
 }

const BGallery = ({images, options = options_default, ...props}) => {
    const [tiles, setTiles] = useState(null)
	const [layout, setLayout] = useState(null);
	const tilesBuffer = useRef({});
	const scene = useRef(false);
    const scenes = useRef(normalizeLayouts(options.layout))
    

    useEffect(()=>{
        const normalized = normalizeTiles(images);
        tilesBuffer.current.tiles = normalized;
        setTiles(normalized)
    },[images])

    function wildUpdate(url, data){
        const update_index = tilesBuffer.current.tiles.findIndex(tile => tile.img === url)
        console.log("update wild tile: "+url+" index: "+update_index);
        tilesBuffer.current.tiles[update_index] = {
            ...tilesBuffer.current.tiles[update_index], 
            aspect: data.aspect, 
            wild:false
        };
        if(!tilesBuffer.current.timeout)
            tilesBuffer.current.timeout = setTimeout(wildRender, 800);
    }

    function wildRender() {
        console.log("wildRender")
        console.log(tilesBuffer.current.tiles)
        tilesBuffer.current.timeout = null;
        setTiles([...tilesBuffer.current.tiles]);
    }
	
    function adjustLayout(container) {
		let new_layout = findLayout(container.width, scenes.current);
		if(scene.current !== new_layout ){
            scene.current = new_layout;
			setLayout(new_layout);
        }
	}

	const galleryRef = useResizeObserver(adjustLayout);

	return (
		<div {...props} ref={galleryRef} className="bGallery">
            <GalleryScene tiles={tiles} layout={layout} wildUpdate={wildUpdate}/>
        </div>
	)
}

export default BGallery;


const normalizeTiles = (user_tiles) => user_tiles.map(tile => {
    if(tile.img && !tile.aspect){
        console.log("found wild: "+ tile.img)
        return {...tile, wild:true, aspect: {w: selectRandom(0.65, 1, 1.5), h:1}};
    }
    else return tile;

})

const selectRandom = (...list) => list[ Math.floor(Math.random() * list.length) ]


const normalizeLayouts = (user_layouts) => {
    const normalized_layouts = user_layouts
        .filter(layout => layout.breakpoint)
        .sort((a, b) => 
              (a.breakpoint > b.breakpoint) ? 1
            : (a.breakpoint < b.breakpoint) ? -1 : 0)
        .map(layout => {
            let tmp_layout = {...layout};
            tmp_layout = normalizeGaps(tmp_layout);
            tmp_layout = normalizeMargins(tmp_layout);

            switch(layoutType(layout)){
                case "rows": return normalizeRows(tmp_layout);
                case "columns": return normalizeColumns(tmp_layout);
                case "grid": return normalizeColumns(tmp_layout);
            }
        });
    return normalized_layouts;
}


const normalizeRows = (layout_input) => layout_input;

const normalizeColumns = (layout_input) => {
    if(typeof(layout_input.columns) === "number")
        return {...layout_input, columns: new Array(layout_input.columns).fill(1)};
    else return layout_input;
}

const normalizeGaps = (layout) => {
    return {...layout, 
        gap: {
            x: (layout.gap && typeof(layout.gap.x) === "number") ? layout.gap.x 
                : (typeof(layout.gap) === "number" ? layout.gap : 0),
            y: (layout.gap && typeof(layout.gap.y) === "number") ? layout.gap.y 
                : (typeof(layout.gap) === "number" ? layout.gap : 0)
    }}
}

const normalizeMargins = (layout) => {
    return {...layout, 
        margin: {
            x: (layout.margin && typeof(layout.margin.x) === "number") ? layout.margin.x 
                : (typeof(layout.margin) === "number" ? layout.margin : 0),
            y: (layout.margin && typeof(layout.margin.y)==="number") ? layout.margin.y 
                : (typeof(layout.margin) === "number" ? layout.margin : 0)
    }}
}


const findLayout = (size, layouts) =>
	layouts.findLast((layout) => layout.breakpoint < size);

const layoutType = (layout) => { 
    if(!layout)
        return undefined
    else if(layout.rows)
        return "rows";
    else if(layout.grid)
        return "grid";
    else if(layout.columns)
        return "columns";
    else return undefined;
}

const GalleryScene = ({layout, tiles, wildUpdate}) => {
    switch(layoutType(layout)){
        case "columns": return <ColumnGallery layout={layout} tiles={tiles} wildUpdate={wildUpdate}/>;
        case "rows": return <RowGallery layout={layout} tiles={tiles} wildUpdate={wildUpdate}/>;
        //case "grid": return <GridGallery layout={layout} images={tiles}/>;
        default: return null;
    }
}

