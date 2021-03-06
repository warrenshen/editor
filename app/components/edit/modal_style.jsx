import $ from 'jquery';
import ClassNames from 'classnames';
import React from 'react';

import Component from 'app/templates/component';

import ModalInput from 'app/components/edit/modal_input';
import OptionStyle from 'app/components/edit/option_style';

import EditorActor from 'app/actors/editor_actor';

import Selector from 'app/helpers/selector';
import Vector from 'app/helpers/vector';

import TypeConstants from 'app/constants/type_constants';

class ModalStyle extends Component {

  // --------------------------------------------------
  // Getters
  // --------------------------------------------------
  static get propTypes() {
    return {
      shouldUpdate: React.PropTypes.bool.isRequired,
      styles: React.PropTypes.object.isRequired,
      updateModalStyle: React.PropTypes.func.isRequired,
      updateStoryStyle: React.PropTypes.func.isRequired,
      vector: React.PropTypes.instanceOf(Vector),
    };
  }

  // --------------------------------------------------
  // State
  // --------------------------------------------------
  getDefaultState() {
    return { shouldShowInput: false };
  }

  showInput(event) {
    this.setState({ shouldShowInput: true });
  }

  // --------------------------------------------------
  // Handlers
  // --------------------------------------------------
  handleMouseUp(event) {
    event.preventDefault();
    event.stopPropagation();
  }

  // --------------------------------------------------
  // Actions
  // --------------------------------------------------
  styleBlocks(type) {
    EditorActor.styleBlocks(this.props.vector, { type: type });
    this.props.updateStoryStyle();
  }

  styleCentered(event) {
    this.styleBlocks(TypeConstants.block.centered);
  }

  styleHeadingOne(event) {
    this.styleBlocks(TypeConstants.block.headingOne);
  }

  styleHeadingTwo(event) {
    this.styleBlocks(TypeConstants.block.headingTwo);
  }

  styleHeadingThree(event) {
    this.styleBlocks(TypeConstants.block.headingThree);
  }

  styleQuote(event) {
    this.styleBlocks(TypeConstants.block.quote);
  }

  styleElements(type, url='') {
    EditorActor.styleElements(this.props.vector, { type: type, url: url });
    this.props.updateStoryStyle();
  }

  styleBold(event) {
    this.styleElements(TypeConstants.element.bold);
  }

  styleItalic(event) {
    this.styleElements(TypeConstants.element.italic);
  }

  styleLink(url) {
    this.styleElements(TypeConstants.element.link, url);
  }

  // --------------------------------------------------
  // Helpers
  // --------------------------------------------------
  createVector(vector) {
    if (vector) {
      var startPoint = vector.startPoint;
      var endPoint = vector.endPoint;
      var sectionNodes = $('section, ol, ul');
      var startNode = sectionNodes[startPoint.sectionIndex]
                      .childNodes[startPoint.blockIndex];
      var endNode = sectionNodes[endPoint.sectionIndex]
                    .childNodes[endPoint.blockIndex];
      var selection = window.getSelection();
      var range = document.createRange();
      var caretOffset = startPoint.caretOffset;
      var currentNode = false;
      var walker = Selector.createTreeWalker(startNode);
      while (walker.nextNode() && caretOffset >= 0) {
        currentNode = walker.currentNode;
        if (caretOffset - currentNode.length <= 0) {
          range.setStart(currentNode, caretOffset);
        }
        caretOffset -= currentNode.length;
      }
      caretOffset = endPoint.caretOffset;
      walker = Selector.createTreeWalker(endNode);
      while (walker.nextNode() && caretOffset >= 0) {
        currentNode = walker.currentNode;
        if (caretOffset - currentNode.length <= 0) {
          range.setEnd(currentNode, caretOffset);
        }
        caretOffset -= currentNode.length;
      }
      selection.removeAllRanges();
      selection.addRange(range);
      this.positionModal(range);
    }
  }

  positionModal(range) {
    var rectangle = range.getBoundingClientRect();
    var node = React.findDOMNode(this.refs.modal);
    var offset = rectangle.width / 2 - node.offsetWidth / 2;
    if (rectangle.top) {
      node.style.top = rectangle.top - 44 + 'px';
      node.style.left = rectangle.left + offset + 'px';
    } else {
      EditorActor.updateVector(null);
      this.props.updateModalStyle();
    }
  }

  // --------------------------------------------------
  // Lifecycle
  // --------------------------------------------------
  componentDidMount() {
    var node = React.findDOMNode(this.refs.modal);
    node.addEventListener('mouseup', this.handleMouseUp.bind(this));
    this.createVector(this.props.vector);
  }

  componentDidUpdate() {
    if (false) {
      console.log('Style modal component updated.');
    }
    if (!this.props.vector && this.state.shouldShowInput) {
      this.setState({ shouldShowInput: false });
    } else if (!this.state.shouldShowInput) {
      this.createVector(this.props.vector);
    }
  }

  componentWillUnmount() {
    var node = React.findDOMNode(this.refs.modal);
    node.removeEventListener('mouseup', this.handleMouseUp);
  }

  shouldComponentUpdate(nextProps, nextState) {
    return nextProps.shouldUpdate ||
           this.state.shouldShowInput !== nextState.shouldShowInput;
  }

  // --------------------------------------------------
  // Render
  // --------------------------------------------------
  renderInput() {
    if (this.state.shouldShowInput) {
      return <ModalInput styleLink={this.styleLink.bind(this)} />;
    }
  }

  renderOption(props, index) {
    return (
      <OptionStyle
        key={index}
        {...props} />
    );
  }

  renderOptions() {
    var styles = this.props.styles;
    return [
      {
        action: this.styleHeadingOne.bind(this),
        className: 'fa fa-header',
        isActive: styles[TypeConstants.block.headingOne] === true,
        isHidden: styles['shouldHideOptions'] || false,
      },
      {
        action: this.styleHeadingTwo.bind(this),
        className: 'fa fa-header',
        isActive: styles[TypeConstants.block.headingTwo] === true,
        isHidden: styles['shouldHideOptions'] || false,
      },
      {
        action: this.styleHeadingThree.bind(this),
        className: 'fa fa-header',
        isActive: styles[TypeConstants.block.headingThree] === true,
        isHidden: styles['shouldHideOptions'] || false,
      },
      {
        action: this.styleQuote.bind(this),
        className: 'fa fa-quote-right',
        isActive: styles[TypeConstants.block.quote] === true,
        isHidden: styles['shouldHideOptions'] || false,
      },
      {
        action: this.styleCentered.bind(this),
        className: 'fa fa-align-center',
        isActive: styles[TypeConstants.block.centered] === true,
        isHidden: styles['shouldHideOptions'] ||
                  styles[TypeConstants.block.quote] || false,
      },
      {
        action: this.styleBold.bind(this),
        className: 'fa fa-bold',
        isActive: styles[TypeConstants.element.bold] === true,
        isHidden: false,
      },
      {
        action: this.styleItalic.bind(this),
        className: 'fa fa-italic',
        isActive: styles[TypeConstants.element.italic] === true,
        isHidden: styles[TypeConstants.block.quote] || false,
      },
      {
        action: this.showInput.bind(this),
        className: 'fa fa-link',
        isActive: styles[TypeConstants.element.link] === true,
        isHidden: false,
      },
    ].map(this.renderOption, this);
  }

  render() {
    var modalClass = ClassNames(
      { 'modal-style': true },
      { 'general-hidden': !this.props.vector }
    );
    return (
      <div className={modalClass} ref='modal'>
        <span className={'vertical-anchor'}></span>
        {this.renderOptions()}
        {this.renderInput()}
        <span className={'modal-style-triangle'}></span>
      </div>
    );
  }
}

module.exports = ModalStyle;
