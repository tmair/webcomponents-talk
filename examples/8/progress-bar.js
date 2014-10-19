(function(document) {
    var importDoc = document.currentScript.ownerDocument;
    var templateLink = importDoc.querySelector('link[rel="import"]');

    // Clone the <template> in the import.
    var template = templateLink.import.querySelector('template');

    var customProto = Object.create(HTMLElement.prototype);
    Object.defineProperty(customProto, "value", {
        get: function () {
            var value = parseInt(this.getAttribute('value'), 10);
            return value;
        },
        set: function (value) {

            this.setAttribute('value', value);
        }});
    customProto.attributeChangedCallback = function (name, oldValue, newValue) {
        if (newValue !== oldValue) {
            var value = parseInt(newValue, 10);
            value = (value === Number.NaN ? 0 : value);
            value = Math.max(Math.min(value, 100), 0);
            this.querySelector('::shadow .value').style.width = value + '%';
            this.querySelector('::shadow .label').innerText = value + '%';
        }
    };
    customProto.attachedCallback = function () {
        var root = this.createShadowRoot();
        var value = Math.max(Math.min(parseInt(this.getAttribute('value'), 10), 100), 0) + '%';

        var content = template.content.cloneNode(true);
        content.querySelector('.value').style.width = value;
        content.querySelector('.label').innerText = value;

        root.appendChild(content);
    };

    document.registerElement('progress-bar', {
        prototype: customProto
    });
})(document);