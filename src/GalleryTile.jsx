import Ymage from 'ymage';


const GalleryTile = ({content, onLoad=false, aspect=false, wildUpdate}) => {
    switch(tileType(content)){
        case "image": return <GalleryImage img={content} onLoad={onLoad} aspect={aspect} wildUpdate={wildUpdate}/>;
        case "component": return <GalleryComponent component={content} onLoad={onLoad} aspect={aspect}/>;
    }
}

export default GalleryTile;


const GalleryImage = ({img, onLoad, aspect, wildUpdate})=>{
	const style = aspect ? {aspectRatio: img.aspect.w + " / " + img.aspect.h} : {};
	return <Ymage 
        style={style}
        url={img.img} 
        onSize={img.wild ? size =>  wildUpdate(img.img, {aspect: {w: size.x, h: size.y}}) : false }
        />
}

const GalleryComponent = ({component, aspect})=>{
    const style = aspect ? {aspectRatio: component.aspect.h + " / " + component.aspect.w} : {};
    return <article style={style}>{component.html}</article>
}

const tileType = (tile) => {
    if(tile.img) return "image";
    else return "text";
}
