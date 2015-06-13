import React from "react";
import Component from "app/templates/component";

import MediaModal from "app/components/media_modal";

import Block from "app/models/block";

import EditorStore from "app/stores/editor_store";

import EditorActor from "app/actors/editor_actor";

import Formatter from "app/helpers/formatter";
import Selector from "app/helpers/selector";

import KeyConstants from "app/constants/key_constants";
import TypeConstants from "app/constants/type_constants";


class BlockComponent extends Component {

  // --------------------------------------------------
  // Handlers
  // --------------------------------------------------
  handleArrowKey(event, point) {
    var block = this.props.block;
    var content = React.findDOMNode(this.refs.content);
    var caretOffset = point.caretOffset;

    switch (event.which) {
      case KeyConstants.down:
        var floorOffset = Selector.findFloorOffset(content);
        if (caretOffset >= floorOffset) {
          event.preventDefault();
          point.caretOffset = caretOffset - floorOffset;
          EditorActor.shiftDown(point);
          this.props.updateStory();
        }
        break;

      case KeyConstants.left:
        if (point.caretOffset === 0) {
          event.preventDefault();
          EditorActor.shiftLeft(point);
          this.props.updateStory();
        }
        break;

      case KeyConstants.right:
        if (point.caretOffset === block.length) {
          event.preventDefault();
          EditorActor.shiftRight(point);
          this.props.updateStory();
        }
        break;

      case KeyConstants.up:
        var ceilingOffset = Selector.findCeilingOffset(content);
        if (caretOffset < ceilingOffset || caretOffset === 0 || ceilingOffset < 0) {
          event.preventDefault();
          EditorActor.shiftUp(point);
          this.props.updateStory();
        }
        break;
    }
  }

  handleKeyDown(event) {
    var selection = window.getSelection();
    var point = Selector.generatePoint(selection);

    if (event.which >= KeyConstants.left && event.which <= KeyConstants.down) {
      if (!event.shiftKey) {
        this.handleArrowKey(event, point);
      }
    } else if (event.which === KeyConstants.backspace) {
      if (point.caretOffset !== 0) {
        var block = this.props.block;
        var caretOffset = point.caretOffset;
        block.removeFragment(caretOffset - 1, caretOffset);

        if (!block.get("content")) {
          event.preventDefault();
          point.caretOffset = 0;
          EditorActor.updatePoint(point);
          this.props.updateStory();
        }
      } else if (!point.matchesValues(0, 0)) {
        event.preventDefault();
        EditorActor.removeBlock(point);
        this.props.updateStory();
      }
    } else if (event.which === KeyConstants.tab) {
      event.preventDefault();
      // handle tab
    }
  }

  handleKeyPress(event) {
    var selection = window.getSelection();
    var point = Selector.generatePoint(selection);

    if (event.which === KeyConstants.enter) {
      event.preventDefault();
      EditorActor.splitBlock(point);
      this.props.updateStory();
    } else {
      var block = this.props.block;
      var content = block.get("content");
      var character = String.fromCharCode(event.which);
      block.addCharacter(point.caretOffset, character);

      if (!content) {
        event.preventDefault();
        point.caretOffset = 1;
        EditorActor.updatePoint(point);
        this.props.updateStory();
      }
    }
  }

  handleMouseMove(event) {
    if (EditorStore.mouseState === TypeConstants.mouse.down) {
      EditorActor.updateMouseState(TypeConstants.mouse.move);

      if (this.props.shouldEnableEdits) {
        this.props.updateStory();
      }
    }
  }

  handleMouseUp(event) {
    if (EditorStore.mouseState !== TypeConstants.mouse.move) {
      event.stopPropagation();

      EditorActor.updateMouseState(TypeConstants.mouse.up);

      var selection = window.getSelection();
      var range = document.caretRangeFromPoint(event.clientX, event.clientY);

      selection.removeAllRanges()
      selection.addRange(range)

      var point = Selector.generatePoint(selection);

      EditorActor.updatePoint(point);
      this.props.updateStates();
    }
  }

  // --------------------------------------------------
  // Lifecycle
  // --------------------------------------------------
  componentDidMount() {
    var content = React.findDOMNode(this.refs.content);
    content.addEventListener("keydown", this.handleKeyDown.bind(this));
    content.addEventListener("keypress", this.handleKeyPress.bind(this));
    content.addEventListener("mousemove", this.handleMouseMove.bind(this));
    content.addEventListener("mouseup", this.handleMouseUp.bind(this));

    this.renderContent(content);
  }

  componentDidUpdate() {
    var content = React.findDOMNode(this.refs.content);

    this.renderContent(content);
  }

  componentWillUnmount() {
    var content = React.findDOMNode(this.refs.content);
    content.removeEventListener("keydown", this.handleKeyDown);
    content.removeEventListener("keypress", this.handleKeyPress);
    content.removeEventListener("mousemove", this.handleMouseMove);
    content.removeEventListener("mouseup", this.handleMouseUp);
  }

  // --------------------------------------------------
  // Render
  // --------------------------------------------------
  renderContent(node) {
    node.innerHTML = Formatter.formatBlock(this.props.block);
  }

  renderModal() {
    var block = this.props.block;
    var point = EditorStore.point;
    if (!block.get("content") && point &&
        point.matchesValues(block.get("section_index"), block.get("index"))) {
      return (
        <MediaModal
          block={this.props.block}
          updateStory={this.props.updateStory} />
      );
    }
  }

  render() {
    return (
      <div>
        <p ref={"content"}></p>
      </div>
    );
  }
}

BlockComponent.propTypes = {
  block: React.PropTypes.instanceOf(Block).isRequired,
  shouldEnableEdits: React.PropTypes.bool.isRequired,
  updateStates: React.PropTypes.func.isRequired,
  updateStory: React.PropTypes.func.isRequired,
};

BlockComponent.defaultProps = {
  block: new Block(),
  shouldEnableEdits: true,
  updateStates: null,
  updateStory: null,
};


module.exports = BlockComponent;
