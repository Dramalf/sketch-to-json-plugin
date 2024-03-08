import sketch from 'sketch/dom';
import UI from 'sketch/ui'
import { writeFileSync } from '@skpm/fs';

const buffer2pngbase64 = buffer => `data:image/png;base64,${buffer.toString('base64')}`;
const genNormalItem = layer => {
  const item = {
    id: layer.id,
    name: layer.name,
    type: layer.type,
    style: layer.style.toJSON(),
    frame: layer.frame.toJSON(),
  }
  if (layer.transform) {
    item.transform = layer.transform.toJSON();
  }
  if (layer.shapeType) {
    item.shapeType = layer.shapeType;
    item.closed = layer.closed;
  }
  if (layer.points) {
    item.points = layer.points;
  }
  return item;
}
const genImageItem = layer => {
  const item = genNormalItem(layer);
  item.url = buffer2pngbase64(sketch.export(layer, {
    formats: 'png',
    output: false
  }))
  return item;
}
const genGroupItem = (layer) => {
  const item = genNormalItem(layer);
  item.children = [];
  return item;
}
const genTextItem = (layer) => {
  const item = genNormalItem(layer);
  item.text = layer.text;
  return item;
}
export default function (context) {
  // 获取当前文档
  const document = sketch.fromNative(context.document);
  if (!document) {
    UI.message('没有选中的图层');
    return
  }
  const selectedLayers = document.selectedLayers;
  if (selectedLayers.isEmpty) {
    UI.message('没有选中的图层');
    return
  }
  // 获取当前选中的图层
  const selection = selectedLayers.layers;
  if (selection.length > 1 || selection[0].type !== 'Group') {
    UI.alert('选中元素元素未编组', '请将选中的元素编组后再导出为json');
    return
  }
  // 为了给用户提供保存文件的选项，我们使用原生的选择器
  const savePanel = NSSavePanel.savePanel();
  savePanel.setNameFieldStringValue("starry-sketch-page.json");
  let layersData = [];
  let coverImage = '';
  if (savePanel.runModal() == NSFileHandlingPanelOKButton) {
    const fileURL = savePanel.URL().path();
    const readLayers = (layers, parent) => {
      layers.map(layer => {
        if (layer.name.includes("_pic")) {
          //_pic表示转图片
          parent.push(genImageItem(layer))
        }
        else if (layer.type === 'Group') {
          const groupItem = genGroupItem(layer);
          parent.push(groupItem);
          readLayers(layer.layers, groupItem.children)
        }
        else if (layer.type === 'Text') {
          parent.push(genTextItem(layer))
        }
        else if (layer.type === 'Image') {
          parent.push(genImageItem(layer))
        } else {
          //其他元素全部默认转图片
          parent.push(genImageItem(layer))
        }
      })

    }
    readLayers(selection, layersData)
    coverImage = buffer2pngbase64(sketch.export(selection[0], {
      formats: 'png',
      output: false
    }))
    const jsonStr = JSON.stringify({ coverImage, layersData }, null, 2);

    // 写入文件
    writeFileSync(fileURL, jsonStr);

    // 通知用户文件已保存
    UI.message('导出为星河JSON成功');
  }
}
