var sizeChart = Class.create({
    initialize: function(formId) {
        this.form = $(formId);
        if (!this.form) {
            return;
        }
        this.table = $('chart_values');
        this.cookieKey = 'sizechart';
        if (this.getCookie(this.cookieKey)) {
            this.units = this.getCookie(this.cookieKey);
            if (this.units === 'cm') {
                this.convertUnits();
            }
        } else {
            this.units = 'in';
        }
        this.chartValues();
        this.setFormText();

    },
    findSize: function() {
        this.removeSelection();
        this.bust = this.form['bust'];
        this.waist = this.form['waist'];
        this.hip = this.form['hip'];
        /* ---- Find index and assign class ---------*/
        var bustIndex = this.closestValueIndex(this.bust.getValue(), this.bustValues);
        this.table.rows[bustIndex].cells[1].addClassName('current');
        var waistIndex = this.closestValueIndex(this.waist.getValue(), this.waistValues);
        this.table.rows[waistIndex].cells[2].addClassName('current');
        var hipIndex = this.closestValueIndex(this.hip.getValue(), this.hipValues);
        this.table.rows[hipIndex].cells[3].addClassName('current');
        /* ---- Find max index for size selection ---------*/
        var array = [bustIndex, waistIndex, hipIndex];
        var sizeIndex = Math.max.apply(null, array);
        this.table.rows[sizeIndex].addClassName('recomended-size');
        var size = this.sizeValues[sizeIndex];
        $('size-value').update(size);

    },
    chartValues: function() {
        this.sizeValues = [];
        this.bustValues = [];
        this.waistValues = [];
        this.hipValues = [];
        rows = this.table.select('tr');
        for (var rowIndex = 0; rowIndex < rows.length; ++rowIndex) {
            cells = rows[rowIndex].select('td');
            for (var index = 0; index < cells.length; ++index) {
                var value = cells[index].innerHTML;
                if (index === 0)
                    this.sizeValues[rowIndex] = value;
                if (index === 1)
                    this.bustValues[rowIndex] = parseInt(value);
                if (index === 2)
                    this.waistValues[rowIndex] = parseInt(value);
                if (index === 3)
                    this.hipValues[rowIndex] = parseInt(value);
            }
        }
    },
    closestValue: function(num, array) {
        var current = array[0];
        array.each(function(value) {
            if (Math.abs(num - value) < Math.abs(num - current)) {
                current = value;
            }
        });
        return current;
    },
    closestValueIndex: function(num, array) {
        var currentIndex = 0;
        var current = array[0];
        for (var index = 0; index < array.length; ++index) {
            value = array[index];
            if (Math.abs(num - value) < Math.abs(num - current)) {
                current = value;
                currentIndex = index;
            }
        }
        return currentIndex;
    },
    removeSelection: function() {
        var rows = this.table.select('tr.recomended-size');
        rows.each(function(element) {
            element.removeClassName('recomended-size');
        });
        var cells = this.table.select('td.current');
        cells.each(function(element) {
            element.removeClassName('current');
        });
    },
    convertUnits: function() {
        this.setUnitText();
        rows = this.table.select('tr');
        var th = $('chart_head').select('th');
        for (var rowIndex = 0; rowIndex < rows.length; ++rowIndex) {
            for (var i = 1; i < th.length; ++i) {
                cell = rows[rowIndex].select('td')[i];
                if (this.units === 'in') {
                    cell.innerHTML = this.convertToInch(cell.innerHTML);
                } else {
                    cell.innerHTML = this.convertToCentimeters(cell.innerHTML);
                }
            }
        }
    },
    changeUnits: function() {
        if (this.units === 'in') {
            this.units = 'cm';
        } else {
            this.units = 'in';
        }
        this.clearForm();
        this.changeCookie();
        this.convertUnits();
        this.chartValues();
    },
    convertToCentimeters: function(val) {
        var cm = val * 2.54;
        return +cm.toFixed(1);
    },
    convertToInch: function(val) {
        var inch = val / 2.54;
        return +inch.toFixed(1);
    },
    clearForm: function() {
        this.form['bust'].clear();
        this.form['waist'].clear();
        this.form['hip'].clear();
    },
    changeCookie: function() {
        this.setCookie(this.cookieKey, this.units, 10);
    },
    getCookie: function(cname) {
        var name = cname + "=";
        var ca = document.cookie.split(';');
        for (var i = 0; i < ca.length; i++) {
            var c = ca[i];
            while (c.charAt(0) === ' ')
                c = c.substring(1);
            if (c.indexOf(name) === 0)
                return c.substring(name.length, c.length);
        }
        return "";
    },
    setCookie: function(cname, cvalue, exdays) {
        var d = new Date();
        d.setTime(d.getTime() + (exdays * 24 * 60 * 60 * 1000));
        var expires = "expires=" + d.toUTCString();
        document.cookie = cname + "=" + cvalue + "; " + expires;
    },
    setUnitText: function() {
        var th = $('chart_head').select('th');
        if (this.units === 'in') {
            $('convertsizeunits').innerHTML = 'Convert to Centimeters';

            /*    th[1].innerHTML = 'Bust (in)';
                th[2].innerHTML = 'Waist (in)';
                th[3].innerHTML = 'Hip (in)';*/
        } else {
            $('convertsizeunits').innerHTML = 'Convert to Inches';
            /*     th[1].innerHTML = 'Bust (cm)';
                 th[2].innerHTML = 'Waist (cm)';
                 th[3].innerHTML = 'Hip (cm)';*/
        }
    },
    setFormText: function() {
        var label = $('sizechart_form').select('label');
        var th = $('chart_head').select('th');
        label[0].innerHTML = th[1].innerHTML;
        label[1].innerHTML = th[2].innerHTML;
        label[2].innerHTML = th[3].innerHTML;
    }
});