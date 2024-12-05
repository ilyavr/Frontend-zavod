import React, {useEffect, useLayoutEffect, useRef, useState} from 'react'
import {Stage, Layer, Rect, Image, Transformer} from 'react-konva';
import useImage from 'use-image';

function DsImage(props){
    const [image] = useImage(props.image)
    return <Image id="dsImage" image={image} width={props.imageWidth} height={props.imageHeight}/>
}

const Rectangle = ({ shapeProps, isSelected, onSelect, onChange, scale}) => {
    const shapeRef = useRef();
    const trRef = useRef();
    useEffect(() => {
        if (isSelected) {
            // we need to attach transformer manually
            trRef.current.nodes([shapeRef.current]);
            trRef.current.getLayer().batchDraw();
        }
    }, [isSelected]);

    let scaledX = shapeProps.x * scale;
    let scaledY = shapeProps.y * scale;
    let scaledWidth = shapeProps.width * scale;
    let scaledHeight = shapeProps.height * scale;
    // if(isNaN(scaledX)) scaledX = 0
    // if(isNaN(scaledY)) scaledY = 0
    // if(isNaN(scaledWidth)) scaledWidth = 0
    // if(isNaN(scaledHeight)) scaledHeight = 0
    return (
        <React.Fragment>
            <Rect
                {...shapeProps}
                x={scaledX}
                y={scaledY}
                width={scaledWidth}
                height={scaledHeight}
                onClick={onSelect}
                onTap={onSelect}
                ref={shapeRef}
                draggable
                onDragEnd={(e) => {
                    onChange({
                        ...shapeProps,
                        x: e.target.x() / scale,
                        y: e.target.y() / scale,
                    });
                }}
                onTransformEnd={(e) => {

                    // transformer is changing scale of the node
                    // and NOT its width or height
                    // but in the store we have only width and height
                    // to match the data better we will reset scale on transform end
                    const node = shapeRef.current;
                    const scaleX = node.scaleX();
                    const scaleY = node.scaleY();

                    // we will reset it back
                    node.scaleX(1);
                    node.scaleY(1);
                    onChange({
                        ...shapeProps,
                        x: node.x() / scale,
                        y: node.y() / scale,
                        // set minimal value
                        width: Math.max(node.width() * scaleX / scale),
                        height: Math.max(node.height() * scaleY / scale),
                    })
                }}
            />
            <Transformer
                ref={trRef}
                boundBoxFunc={(oldBox, newBox) => {
                    // limit resize
                    if (newBox.width < 5 || newBox.height < 5) {
                        return oldBox;
                    }
                    return newBox;
                }}
                rotateEnabled={false}
                borderEnabled={false}
                anchorFill={"rgb(0,200,0)"}
                anchorCornerRadius={10}
                anchorStrokeWidth={0}
                anchorSize={15}
                padding={0}
                keepRatio={true}
                ignoreStroke={false}
            />
        </React.Fragment>
    );
};



function DsEditor(props){
    const [rectangles, setRectangles] = useState([]);
    const [selectedId, selectShape] = useState(null);
    const [containerWidth, setContainerWidth] = useState(0);
    const [containerHeight, setContainerHeight] = useState(0);
    const [imageSize, setImageSize] = useState({ width: 0, height: 0 });

    const containerRef = useRef();
    const stageRef = useRef();

    const [scale, setScale] = useState(1);

    useEffect(() => {
        setRectangles(props.rect)
    }, [props.rect])

    useEffect(() => {
        const imageElement = new window.Image();
        imageElement.src = props.image;
        setImageSize({ width: imageElement.width, height: imageElement.height });
        const handleResize = () => {
            if (containerRef.current){//containerRef.current) {
                setContainerWidth(containerRef.current.offsetWidth);
                setContainerHeight(containerRef.current.offsetHeight);
            }
        };
        handleResize()

        window.addEventListener('resize', handleResize);
        return () => {
            window.removeEventListener('resize', handleResize);
        };
    }, [props.image]);

    useEffect(() => {
        if(imageSize.width !== 0 && imageSize.height !== 0)
            setScale(Math.min(containerWidth/imageSize.width, containerHeight/imageSize.height))
    }, [containerWidth, containerHeight]);


    const checkDeselect = (e) => {
        // deselect when clicked on empty area
        const clickedOnEmpty = e.target.attrs.id === "dsImage";
        if (clickedOnEmpty) {
            selectShape(null);
        }
    };

        return (
            <div id={"dsEditorContainer"} ref={containerRef} style={{ width: '100%', height: '100%', overflow: 'hidden' }}>
                <Stage
                    width={imageSize.width * scale}
                    height={imageSize.height * scale}
                    onMouseDown={checkDeselect}
                    onTouchStart={checkDeselect}
                    ref={stageRef}
                >
                    {()=> console.log(props.image)}
                    <Layer>
                        <DsImage image={props.image}
                                 imageWidth={imageSize.width*scale}
                                 imageHeight={imageSize.height*scale}
                        />
                        {rectangles.map((rect, i) => {
                            return (
                                <Rectangle
                                    key={i}
                                    shapeProps={rect}
                                    isSelected={rect.id === selectedId}
                                    onSelect={() => {
                                        selectShape(rect.id);
                                    }}
                                    onChange={(newAttrs) => {
                                        const rects = rectangles.slice();
                                        rects[i] = newAttrs;
                                        setRectangles(rects);
                                        props.setRectFunc(rects);
                                    }}
                                    scale={scale}
                                />
                            );
                        })}
                    </Layer>
                </Stage>
            </div>
        );

}

export default DsEditor