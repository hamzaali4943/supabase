import useSupabase from 'src/boot/supabase'
import shortid from 'shortid'
import moment from 'moment'
export default function useApi() {
  const { supabase } = useSupabase()

  const list = async (table) => {
    const { data, error } = await supabase
      .from(table)
      .select('*')
    if (error) throw error
    return data
  }

  const getById = async (table, id) => {
    const { data, error } = await supabase
      .from(table)
      .select(`* ,
      orditm:orditm ( * ),
      ordtrl:ordtrl ( ord_id)`)
      .eq('ord_id', id)
    if (error) throw error
    return data[0]
  }


  const post = async (table, form) => {
    const { data, error } = await supabase
      .from(table)
      .insert([
        {
          ...form
        }
      ])
    if (error) throw error
    return data
  }

  const update = async (table, form) => {
    const { data, error } = await supabase
      .from(table)
      .update({ ...form })
      .match({ ord_id: form.ord_id })
    if (error) throw error
    return data
  }

  const remove = async (table, ord_id) => {
    const { data, error } = await supabase
      .from(table)
      .delete()
      .match({ ord_id })
    if (error) throw error
    return data
  }

  const createOrUpdate = async (table, items) => {
    const { data, error } = await supabase
      .from(table)
      .upsert(items)
    if (error) {
      console.log(error)
      throw error
    }
    return data
  }

  const customLogic = async (table, items, file) => {
    let ids = items.map(e => e.ord_id);
    let success = items.length

    //get list of matching ids
    if (table == 'ordhdr') {
      const { data, error } = await supabase
        .from(table)
        .select('ord_id')
        .in('ord_id', ids)
      if (error) throw error
      if (data.length) {
        const ordtrl = items.filter(a => data.some(b => a.ord_id == b.ord_id));
        const { data1, error } = await supabase
          .from('ordtrl')
          .upsert(ordtrl)
        if (error) throw error
        success = success - ordtrl.length
      }
    }
    await post("logs", { id: shortid.generate(), filename: file })
    await createOrUpdate(table, items);
    return { success: success }
  }

  const getByDate = async (table = 'ordhdr', startDate, endDate, company) => {
    if (!startDate) {
      startDate = moment('12/4/2021', "DD-MM-YYYY").subtract(0, 'days').format("DD-MM-YYYY");
    }
    if (!endDate)
      endDate = moment().format("DD-MM-YYYY");
    let query = supabase
      .from(table)
      .select('ord_id, ord_num, ord_createAt, ord_amtTotal, comments')
      .order('ord_id', { ascending: false })
    if (company) { query = query.eq('company', company) }
    if (startDate) { query = query.gte('ord_createAt', startDate.toString()) }
    if (endDate) { query = query.lt('ord_createAt', endDate.toString()) }

    const { data, error } = await query;

    if (error) throw error
    data.forEach(e=>{
      if(e.comments!=null)
        e.comments=e.comments.comment;
    })
    return data
  }


  return {
    list,
    getById,
    post,
    update,
    remove,
    createOrUpdate,
    customLogic,
    getByDate
  }
}
