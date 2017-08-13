function existy(x) {
    return x != null
}

function truthy(x) {
    return (x !== false) && existy(x)
}

function cat() {
    let head = _.first(arguments);
    if (existy(head)) {
        return head.concat.apply(head, _.rest(arguments));
    } else {
        return [];
    }
}

function construct(head, tail) {
    return cat([head], _.toArray(tail));
}

// 为对象属性重命名
function rename(obj, newNames) {
    return _.reduce(newNames, function (o, nu, old) {
            if (_.has(obj, old)) {
                o[nu] = obj[old];
                return o;
            } else {
                return o;
            }
        },
        _.omit.apply(null, construct(obj, _.keys(newNames))));
}

// 为对象属性设置别名
function as(table, newNames){
	return _.map(table, function(obj){
		return rename(obj, newNames);
	});
}
var library = [
	{title: 'sicp', isbn: '0234', ed: 1},
	{title: 'sicp', isbn: '0235', ed: 2},
	{title: 'joy', isbn: '0236', ed: 1},
];

//接收一个函数，作为对表中的每个对象的谓词。每当谓词返回false是，该对象不会出现在新表中
function restrict(table, pred){
	return _.reduce(table, function(newTable, obj){
		if (truthy(pred(obj))) {
			return newTable;
		} else {
			return _.without(newTable, obj)
		}
	}, table)
}

function complement(PRED) {
	return function () {
		return !PRED.apply(null, _.toArray(arguments))	
	};
}

function isEven(n) {
	return (n%2) === 0;
}

let pingpong = (function () {
	let PRIVATE = 0;
	return {
		inc: function (n) {
			return PRIVATE += n;
		},
		dec: function (n) {
			return PRIVATE -= n;
		}
	};
})();

function plucker (FIELD) {
	return function (obj) {
		return (obj && obj[FIELD])
	}
}

function finder(valueFun, bestFun, coll) {
	return _.reduce(coll, function (best, current) {
		var bestValue = valueFun(best);
		var currentValue = valueFun(current);
		return (bestValue === bestFun(bestValue, currentValue)) ? best : current; 
	});
}

function best(fun, coll){
	return _.reduce(coll, function (x, y) {
		return fun(x, y) ? x : y;	
	});	
}

function repeat(times, VALUE) {
	return _.map(_.range(times), function () { return VALUE; })
}

function repeatedly(times, fun) {
	return _.map(_.range(times), fun);
}

function iterateUntil(fun, check, init) {
	let ret = [];
	let result = fun(init);

	while (check(result)){
		ret.push(result);
		result = fun(result);
	}
	return ret;
}

function always(VALUE){
	return function (){
		return VALUE;
	}
}

function invoker(NAME, METHOD){
	return function(target){
		if (!existy(target)) fail("Must provide a target");
		let targetMethod = target[NAME];
		let args = _.rest(arguments);
		return doWhen((existy(targetMethod) && METHOD === targetMethod), function () {
			return targetMethod.apply(target, args);
		})
	}
}

// 唯一字符串
function uniqueString(len) {
	return Math.random().toString(36).substr(2, len);
}

// 特定前缀字符串
function uniqueString(prefix) {
	return [prefix, new Date().getTime()].join('');
}

// 捕获增量值
function makeUniqueStringFunction(start) {
	let COUNTER = start;
	return function(prefix) {
		return [prefix, COUNTER++].join('');
	};
}
// 检查参数是否是null或undefined，若是则用默认参数替换
function fnull(fun){
	let defaults = _.rest(arguments);
	return function () {
		let args = _.map(arguments, function (e, i){
			return existy(e) ? e : defaults[i];
		});
		return fun.apply(null, args);
	}
}

function checker(){
	let validators = _.toArray(arguments);
	return function (obj){
		return _.reduce(validators, function(errs, check){
			if(check(obj)){
				return errs;
			} else {
				return _.chain(errs).push(check.message).value();
			}
		}, []);
	};
}

function validator(msg, fun){
	let f = function(){
		return fun.apply(fun, arguments);
	};
	f['message'] = msg;
	return f;
}

function aMap(obj) {
	return _.isObject(obj);
}

function hasKeys() {
	let KEYS = _.toArray(arguments);
	let fun = function(obj){
		return _.every(KEYS, function (k){
			return _.has(obj, k);
		})
	};
	fun.message = cat(['Must have values for keys:'], KEYS).join(" ");
	return fun;
}

function dispatch() {
	let funs = _.toArray(arguments);
	let size = funs.length;

	return function (target) {
		let ret = undefined;
		let args = _.rest(arguments);
		for(let funIndex = 0; funIndex < size; funIndex++){
			let fun = funs[funIndex];
			ret = fun.apply(fun, construct(target, args));
			if (existy(ret)) return ret;	
		}
		return ret;
	}
}

function stringReverse(s) {
	if (!_.isString(s)) {
		return undefined;
	}
	return s.split('').reverse().join('');
}

function isa (type, action) {
	return function (obj) {
		if (type === obj.type) {
			return action(obj)
		}
	}
}

function rightAwayInvoker() {
	let args = _.toArray(arguments);
	let method = args.shift();
	let target = args.shift();
	return method.apply(target, args);
}

function rigthCurryDiv(d) {
	return function (n) {
		return n/d;
	};
}

function curry(fun) {
	return function(arg) {
		return fun(arg);
	};
}

function curry2(fun) {
	return function(secondArg) {
		return function(firstArg) {
			return fun(firstArg, secondArg);
		}
	}
}

function div(n, d) {
	return n / d;
}

let plays = [
	{artist: 'fanerge', track: 'argsd'}
]

function curry3 (fun) {
	return function (last) {
		return function (middle) {
			return function (first) {
				return fun(first, middle, last);	
			};
		};
	};
}

function toHex(n) {
	let hex = n.toString(16);
	return (hex.length < 2) ? [0, hex].join('') : hex;
}

function rgbToHexString(r, g, b) {
	return ['#', toHex(r), toHex(g), toHex(b)].join('');
}

function partial1 (fun, arg1) {
	return function () {
		let args = construct(args, arguments);
		return fun.apply(fun, args);
	};
}

function partial (fun) {
	let pargs = _.rest(arguments);
	return function () {
		let args = cat(pargs, _.toArray(arguments));
		return fun.apply(fun, args);
	};
}

let zero = validator('cannot be zero', function (n) { return 0 === n });
let number = validator('arg must be a number', _.isNumber);

function sqr(n) {
	if (!number(n)) {
		throw new Error(number.message);
	}
	if (zero(n)) {
		throw new Error(zero.message);
	}
	return n * n;
}

function condition1() {
	let validators = _.toArray(arguments);
	return function (fun, arg) {
		let errors = mapcat(function(isValid){
			return isValid(arg) ? [] : [isValid.message];
		}, validators);
		if (!_.isEmpty(errors)) {
			throw new Error(error.join(','));
		}
		return fun(arg);
	};
}

function myLength (ary) {
	if (_.isEmpty(ary)) {
		return 0;
	} else {
		return 1 + myLength(_.rest(ary));
	}
}

function cycle(times, ary) {
	if (times <= 0) {
		return [];
	} else {
		return cat(ary, cycle(times -1, ary));
	}
}

function constructPair(pair, rests) {
	return [construct(_.first(pair), _.first(rests)),
	construct(second(pair), second(rests))]
}

function unzip(pairs) {
	if (_.isEmpty(pairs)) {
		return [[], []];
	}
	return constructPair(_.first(pairs), unzip(_.rest(pairs)))
}

function andify () {
	let preds = _.toArray(arguments);
	return function () {
		let args = _.toArray(arguments);
		let everything = function (ps, truth) {
			if (_.isEmpty(ps)) {
				return truth;
			} else {
				return _.every(args, _.first(ps))
						&& everything(_.rest(ps), truth);
			}
		};
		return everything(preds, true);
	};
}

function orify () {
	let preds = _.toArray(arguments);
	return function () {
		let args = _.toArray(arguments);
		let something = function (ps, truth) {
			if (_.isEmpty(ps)) {
				return truth;
			} else {
				return _.some(args, _.first(ps))
						|| something(_.rest(ps), truth);
			}
		};
		return something(preds, true);
	};
}

// 相互递归调用
function evenSteven(n) {
	if (n === 0) {
		return true;
	} else {
		return oddJohn(Math.abs(n) - 1);
	}
}

function oddJohn(n) {
	if (n === 0) {
		return false;
	} else {
		return evenSteven(Math.abs(n) - 1);
	}
}

function flat(array) {
	if (_.isArray(array)) {
		return cat.apply(cat, _.map(array, flat));
	} else {
		return [array];
	}
}

function deepClone(obj) {
	if (!existy(obj) || !_.isObject(obj)) {
		return obj;
	}
	let temp = new obj.constructor();
	for (let key in obj) {
		if (obj.hasOwnProperty(key)) {
			temp[key] = deepClone(obj[key]);
		}
	}
	return temp;
}

// 遍历嵌套数组的数组
function visit(mapFun, resultFun, array) {
	if (_.isArray(array)) {
		return resultFun(_.map(array, mapFun));
	} else {
		return resultFun(array);
	}
}

function summ (array) {
	let result = 0;
	let sz = array.length;
	for (let i = 0; i < sz; i++) {
		result += array[i];
	}
	return result;
}

function summRec (array, seed) {
	if (_.isEmpty(array)){
		return seed;
	} else {
		return summRec(_.rest(array), _.first(array) + seed)
	}
}

function deepFreeze(obj) {
	if (!Object.isFrozen(obj)) {
		Object.freeze(obj);
	}
	for (let key in obj) {
		if (!obj.hasOwnProperty(key) || !_.isObject(obj[key])) {
			continue;
		}
		deepFreeze(obj[key]);
	}
}

function Container (init) {
	this._value = init;
}
Container.prototype = {
	update: function (fun) {
		let args = _.rest(arguments);
		let oldValue = this._value;

		this._value = fun.apply(this, constructor(oldValue, args));
		return this._value;
	}
};

function createPerson () {
	let firstName = '';
	let lastName = '';
	let age = 0;
	return {
		setFirstName: function (fn) {
			firstName = fn;
			return this;	
		},
		setLastName: function (fn) {
			lastName = fn;
			return this;	
		},
		setAge: function (fn) {
			age = fn;
			return this;
		},
		toString: function () {
			return [firstName, lastName, age].join(' ');
		}
	};
}

function Container (val) {
	this._value = val;
	this.init(val);
}
Container.prototype.init = _.identity;

let c = new Container(42)

let Hole = function (val) {
	Container.call(this, val);
}
let HoleMixin = {
	setValue: function (newValue) {
		let oldVal = this._value;
		this.validate(newValue);
		this._value = newValue;
		this.notify(oldVal, newValue);
		return this._value;
	},
};

let ObserverMixin = (function () {
	let _watchers = [];
	return {
		watch: function (fun) {
			_watchers.push(fun);
			return _.size(_watchers);
		},
		notify: function (oldVal, newVal) {
			_.each(_._watchers, function (watcher) {
				watcher.call(this, oldVal, newVal);
			});
			return _.size(_watchers);
		}
	};
});

let ValidateMixin = {
	addValidator: function (fun) {
		this._validator = fun;
	},
	init: function (val) {
		this.validate(val);
	},
	validate: function (val) {
		if (existy(this._validator) &&
			!this._validator(val)) {
			fail('Attrmpted to set invalid value' + polyToString(val));
		}

	}
};

let SwapMixin = {
	swap: function (fun) {
		let args = _.rest(arguemnts);
		let newValue = fun.apply(this, _.identity);
		return this.setValue(newValue);
	},
};
let o = {_value: 0, setValue: _.identity}
_.extend(o, SwapMixin);
o.swap(construct, [1, 2, 3]); //[0, 1, 2, 3]













