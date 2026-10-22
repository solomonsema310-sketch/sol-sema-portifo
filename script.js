function qs(s){return document.querySelector(s)}
function handleForm(formSel, btnSel, successText){
  var form=qs(formSel); if(!form) return; var btn=form.querySelector(btnSel);
  form.addEventListener('submit',function(e){
    e.preventDefault(); if(!btn) return; var original=btn.textContent;
    btn.disabled=true; btn.textContent='Sending...';
    var msg=document.createElement('div');
    msg.style.marginTop='10px'; msg.style.color='#59D845'; msg.style.fontWeight='600'; msg.style.textAlign='center';
    setTimeout(function(){
      btn.disabled=false; btn.textContent=original; msg.textContent=successText; form.appendChild(msg);
      setTimeout(function(){ msg.remove(); form.reset(); },3000);
    },1000);
  });
}
function enhanceButtons(){
  var buttons=document.querySelectorAll('.contact-btn');
  buttons.forEach(function(b){
    b.addEventListener('pointerdown',function(){ b.style.transform='scale(0.98)'; });
    b.addEventListener('pointerup',function(){ b.style.transform=''; });
    b.addEventListener('pointerleave',function(){ b.style.transform=''; });
  });
}
function mobileMenuCloseOnNav(){
  var menu=qs('#menu-toggle'); var links=document.querySelectorAll('.mobile-nav a');
  if(!menu) return; links.forEach(function(l){ l.addEventListener('click',function(){ menu.checked=false; }); });
}
function adaptButtonLabels(){
  var mq=window.matchMedia('(max-width: 480px)');
  function apply(){
    var contact=qs('.contact-form .contact-btn');
    var reg=qs('.registration-form .contact-btn');
    if(mq.matches){
      if(contact) contact.textContent='Send';
      if(reg) reg.textContent='Submit';
    } else {
      if(contact) contact.textContent='Send Message';
      if(reg) reg.textContent='Submit Registration';
    }
  }
  mq.addEventListener('change',apply); apply();
}
document.addEventListener('DOMContentLoaded',function(){
  handleForm('#contact .contact-form','.contact-btn','Message sent successfully');
  handleForm('.registration-form','.contact-btn','Registration submitted successfully');
  enhanceButtons();
  mobileMenuCloseOnNav();
  adaptButtonLabels();
  setupCalculator();
});
function calculateExpression(expr){
  var tokens=tokenize(expr);
  var rpn=toRPN(tokens);
  return evalRPN(rpn);
}
function tokenize(expr){
  expr=String(expr||'').replace(/\s+/g,'');
  var tokens=[], i=0, prev=null;
  while(i<expr.length){
    var ch=expr[i];
    if(/[0-9.]/.test(ch)){
      var num=ch; i++;
      while(i<expr.length && /[0-9.]/.test(expr[i])){ num+=expr[i]; i++; }
      var v=parseFloat(num); if(!isFinite(v)) throw new Error('NaN');
      tokens.push({t:'num', v:v}); prev='num'; continue;
    }
    if(ch==='('){ tokens.push({t:'(', v:'('}); i++; prev='(' ; continue; }
    if(ch===')'){ tokens.push({t:')', v:')'}); i++; prev=')'; continue; }
    if(ch==='%'){ tokens.push({t:'op', v:'%'}); i++; prev='op'; continue; }
    if('+-*/^'.indexOf(ch)!==-1){
      var op=ch;
      if(op==='-' && (prev==null || prev==='op' || prev==='(')) tokens.push({t:'op', v:'u-'});
      else tokens.push({t:'op', v:op});
      i++; prev='op'; continue;
    }
    throw new Error('Invalid character');
  }
  return tokens;
}
function toRPN(tokens){
  var out=[], ops=[];
  var prec={'u-':4,'%':4,'^':3,'*':2,'/':2,'+':1,'-':1};
  var assoc={'u-':'right','%':'right','^':'right','*':'left','/':'left','+':'left','-':'left'};
  for(var i=0;i<tokens.length;i++){
    var t=tokens[i];
    if(t.t==='num'){ out.push(t); continue; }
    if(t.t==='op'){
      while(ops.length){
        var top=ops[ops.length-1];
        if(top.t==='op' && ((prec[top.v]>prec[t.v]) || (prec[top.v]===prec[t.v] && assoc[t.v]==='left'))){ out.push(ops.pop()); }
        else break;
      }
      ops.push(t); continue;
    }
    if(t.t==='('){ ops.push(t); continue; }
    if(t.t===')'){
      var found=false;
      while(ops.length){ var tt=ops.pop(); if(tt.t==='('){ found=true; break; } out.push(tt); }
      if(!found) throw new Error('Mismatched');
      continue;
    }
  }
  while(ops.length){ var tt=ops.pop(); if(tt.t==='('||tt.t===')') throw new Error('Mismatched'); out.push(tt); }
  return out;
}
function evalRPN(rpn){
  var st=[];
  for(var i=0;i<rpn.length;i++){
    var t=rpn[i];
    if(t.t==='num'){ st.push(t.v); continue; }
    if(t.t==='op'){
      if(t.v==='u-'){ if(!st.length) throw new Error('Operand'); st.push(-st.pop()); continue; }
      if(t.v==='%'){ if(!st.length) throw new Error('Operand'); st.push(st.pop()/100); continue; }
      var b=st.pop(), a=st.pop(); if(a===undefined||b===undefined) throw new Error('Operand');
      var r;
      if(t.v==='+') r=a+b; else if(t.v==='-') r=a-b; else if(t.v==='*') r=a*b; else if(t.v==='/'){ if(b===0) throw new Error('DivZero'); r=a/b; } else if(t.v==='^') r=Math.pow(a,b);
      st.push(r); continue;
    }
    throw new Error('BadToken');
  }
  if(st.length!==1) throw new Error('BadExpr');
  return st[0];
}
function setupCalculator(){
  var form=qs('.calculator-form'); var input=qs('#calc-input'); var btn=qs('#calc-btn'); var result=qs('#calc-result');
  if(!form||!input||!btn||!result) return;
  function show(text,isError){ result.textContent=text; result.style.color=isError?'#ff6666':'#59D845'; }
  function run(){ try{ var val=calculateExpression(input.value); if(!isFinite(val)) throw new Error('Invalid'); show(String(val),false); } catch(e){ show('Invalid expression',true); } }
  form.addEventListener('submit',function(e){ e.preventDefault(); run(); });
  btn.addEventListener('click',run);
}
